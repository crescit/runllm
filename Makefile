install_node:
    cd ~ && \
    curl -sL https://deb.nodesource.com/setup_8.x -o nodesource_setup.sh && \
    sudo bash nodesource_setup.sh && \
    sudo apt install nodejs

install_python:
	add-apt-repository ppa:deadsnakes/ppa -y
	sudo apt install python3.8 -y

run_llm_build:
	
	

all: install_node install_python
#make install_node