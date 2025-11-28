#!/bin/bash
trap "echo manual abort; trap - SIGTERM && kill -- -$$; exit 1"  1 2 3 15

# set yaml pipeline env
export PIPELINE_CONFIG="/data/pipelines/peoplecounting_v1.yaml"

# try
(
  set -e
  dump_config
  echo "INFO: Dump configuration success..."
)
# catch
errorStatus=$?
if [ $errorStatus -ne 0 ]; then
  echo "ERROR: Dump configuration failed...Exit"
  exit $errorStatus
fi

isRunning=0
startTime=7
endTime=23
meminfoInterval=30 # minute

echo "INFO: startTime=${startTime}, endTime=${endTime}, meminfoInterval=${meminfoInterval}m..."
while [ 1 ] ; do
    HOUR="$(date +'%H')"
    # echo $HOUR
    if [ $HOUR -ge $startTime -a $HOUR -lt $endTime ] ; then
        if [ $isRunning == 0 ] ; then
            echo "INFO: Running gstd..."
            gstd &
            gstd_pid=$!
            echo "gstd run with pid=${gstd_pid}..."
            sleep 5

            echo "INFO: Running application..."
            gst-launch-1.0 periodsrc interval=60 ! superviser ! kafkasink proto-lib=/opt/nvidia/deepstream/deepstream-5.0/lib/libnvds_kafka_proto.so config=/data/configs/kafka.txt &
            monitor_pid=$!
            echo "monitor run with pid=${monitor_pid}"
            sleep 30

            isRunning=1
            # sleep 30
            # Init interval time
            meminfoNowTime="$(date +'%M')"
            meminfoNextTime=$(expr $meminfoNowTime + $meminfoInterval - $meminfoNowTime % $meminfoInterval)
        else
            if ! [ -n "${gstd_pid}" -a -d "/proc/${gstd_pid}" ] || ! [ -n "${monitor_pid}" -a -d "/proc/${monitor_pid}" ]; then
                echo "ERROR: App died..."
                echo "ERROR: Killing application..."
                exit 0
            fi
            # sleep 5
        fi

        # Memory Checking
        meminfoNowTime="$(date +'%M')"
        if [[ $meminfoNowTime < 10 ]] ; then
            # convert number 01 to 1
            meminfoNowTime=$(expr $meminfoNowTime % 10)
        fi

        if [[ $meminfoNowTime == $meminfoNextTime ]] ; then
            meminfoNextTime=$(expr $meminfoNowTime + $meminfoInterval)
            meminfoNextTime=$(expr $meminfoNextTime % 60)
            
            timestamp="$(date +'%s')"
            echo "INFO: $(cat /proc/${gstd_pid}/status | grep VmRSS), timestamp: ${timestamp}"
        fi
    else
        if [ $isRunning == 1 ] ; then
            echo "INFO: Killing gstd..."
            kill -9 $gstd_pid
            kill -9 $monitor_pid
            echo "INFO: Sleeping till dawn..."
            isRunning=0
        else
            sleep 50
        fi
    fi
done