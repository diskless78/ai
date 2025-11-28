# Introduction

Nhánh master được base từ tag 0.3.0: https://github.com/Megvii-BaseDetection/YOLOX


## Export ONNX

yolox_nano.py: config file

```bash
python tools/export_onnx.py --output-name weights/latest_ckpt.onnx \
  --img_size 288 480 \
  -f exps/default/yolox_nano.py \
  -c weights/latest_ckpt.pth --no-onnxsim
```

- /cpp: export tensort
- /deepstream: code test deepstream

## Export TensorRT

```
cd cpp && mkdir build && cd build
cmake -DCMAKE_CUDA_FLAGS="--expt-extended-lambda -std=c++14" ..
make -j4
./export [onnx_path] [trt_path]
./export_rotate [onnx_path] [trt_path]  // for rotate
```

## Model zoo

S3 storage: https://drive.google.com/drive/folders/18gAtJaL2wBI17iQAMr4-JuVpxN4WJCLG?usp=share_link

| Backbone                        |    Train+Eval    |             Config             | mAP_640</br>@[IoU=0.50:0.95] | GTX1650 TRT(288,480)  | Jetson Nano  TRT</br>(288,480) |
| ------------------------------- | :--------------: | :----------------------------: | :--------------------------: | :-------------------: | :----------------------------: |
| yolox_nano_220301.pth           |       coco       |         yolox_nano.py          |           0.43725            | 2.5ms ms;</br>400 FPS |     22.83 ms;</br>43.8 FPS     |
| yolox_nano_220316.pth           |      merge       |         nano_220316.py         |                              |          nt           |               nt               |
| yolox_nano_220330.pth           |      merge       |         nano_220316.py         |                              |          nt           |               nt               |
| yolox_nano_220407.pth           |      merge       |         nano_220316.py         |                              |          nt           |               nt               |
| yolox_nano_220407.pth           |      merge       |         nano_220316.py         |                              |          nt           |               nt               |
| nano_20220627.pth               |      merge       |         nano_220316.py         |                              |          nt           |               nt               |
| nano_rotate_20220609.pth        |      merge       |         nano_220316.py         |                              |                       |                                |
| nano_rotate_20220620.pth        |      merge       |    nano_rotate_20220620.py     |                              |                       |                                |
| person_nano_rotate_20220818.pth | merge-Pharmacity | person_nano_rotate_20220818.py |             0.42             |                       |                                |
| nano_20221102.pth               |      merge       |         nano_220316.py         |                              |          nt           |               nt               |

| Name | Train | Config | mAP_640</br>@[IoU=0.50:0.95] |
| ---- | :---: | :----: | :--------------------------: |
| nano_20230323.pth | +20220315_PMC | nano_230323.py | 20220315_PMC_val: 67.023 <br />20221123_images_val: 46.306 |

## Updates!!

**2023/03/23**: Update model
  * Bổ sung 20220315_PMC: Dữ liệu khu vực cửa sổ

**2022/11/02**: Update model
  * Bổ sung genviet: aeonHD, bigcVing, oceanPark

**2022/06/07**: Update rotate
  * Tính cost dùng iou rotate
  * loss giữ nguyên iou thẳng
  * Sử dụng eval thẳng để đánh giá

**2022/06/23**: Update yolox parser plugin
  * Đưa property muxer-width, muxer-height. Default = (1920, 1080)
  * Hỗ trợ fisheye (phát hiện nếu có góc)

**2022/06/27**: Update release exp: nano_220316 (migrate latest version)

**2022/07/14**: 
  * Fix bug export model fisheye code.
  * Update fisheye metadata: detail in [README](deepstream/plugins/README.md)

**2022/08/19**: 
  * Refactor code. yolox:0.3.0
  * Update fisheye metadata name: FisheyeData
  * Release person_yolox_nano_rotate: person_nano_rotate_20220818.pth
