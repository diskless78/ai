# ENV
python3 -m venv .venv
source .venv/bin/activate
pip3 install -r requirements.txt

# Data labaling

pip3 install label-studio
label-studio

# Install label studio in Ubuntu
python3 -m venv env
source env/bin/activate
sudo apt install python3.9-dev
python -m pip install label-studio or sudo ./env/bin/python3 ./env/bin/label-studio start --port 81
sudo nohup ./env/bin/python3 ./env/bin/label-studio start --port 81 > label_studio.log 2>&1 &

# Uninstall
sudo pkill -f label-studio
sudo rm -rf /root/.local/share/label-studio/
macOS: sudo rm -rf ~/Library/Application\ Support/label-studio/

https://labelstud.io/guide/install#Install-on-Ubuntu
