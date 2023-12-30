install_node:
    cd ~ && \
    curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh && \
    sudo bash nodesource_setup.sh && \
    sudo apt install nodejs

install_python:
    add-apt-repository ppa:deadsnakes/ppa -y && \
    sudo apt install python3.8 -y

install_llm:
    cd ~/llm && \
    bash build.sh

install_langchain:
    cd ~/langchain && \
    pip3 instal langchain
    pip3 install -r requirements.txt

all: install_node install_python install_llm install_langchain
