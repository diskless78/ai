trap "echo manual abort; trap - SIGTERM && kill -- -$$; exit 1"  1 2 3 15

export CUDA_VISIBLE_DEVICES=1
export BOX_ID=boxid
export CONFIG='{"list_camera":[{"cam_id":"lamer1","gender_usage":0,"url":"rtsp://admin:meditech123@192.168.100.41:554/","config":{"direction":[],"zone":[{"ID":"cua","coord":[0.547, 0.533, 0.538, 0.864],"axis":[0.482, 0.662, 0.625, 0.66]}],"heatmap":{},"layout":{}}}, {"cam_id":"lamer2","gender_usage":0,"url":"rtsp://localhost:8554/stream1","config":{"direction":[],"zone":[{"ID":"cua","coord":[0.547, 0.533, 0.538, 0.864],"axis":[0.482, 0.662, 0.625, 0.66]}],"heatmap":{},"layout":{}}}, {"cam_id":"lamer3","gender_usage":0,"url":"rtsp://localhost:8554/stream2","config":{"direction":[],"zone":[{"ID":"cua","coord":[0.547, 0.533, 0.538, 0.864],"axis":[0.482, 0.662, 0.625, 0.66]}],"heatmap":{},"layout":{}}}]}'


gstd &
gstd_pid=$!
echo "gstd run with pid=${gstd_pid}..."
sleep 5

gst-launch-1.0 --gst-plugin-path=/research/project/gst-people-analytics/build kafkasrc ! fakesink

echo "Killing gstd pid=${gstd_pid}..."
kill -9 $gstd_pid