
export LLAMA_METAL=1

if [ ! -d "llama.cpp" ]; then
  git clone https://github.com/ggerganov/llama.cpp
fi

pushd llama.cpp
git pull
make clean
LLAMA_METAL=1 make
popd

pushd llama.cpp/models

if [ ! -f "wizardlm-7b-v1.0-uncensored.ggmlv3.q4_1.bin" ]; then
  curl -L -O https://huggingface.co/TheBloke/WizardLM-7B-V1.0-Uncensored-GGML/resolve/main/wizardlm-7b-v1.0-uncensored.ggmlv3.q4_1.bin
fi

popd


if [ ! -d "ggml" ]; then
  git clone https://github.com/ggerganov/ggml.git
fi
pushd ggml
mkdir -p build
pushd build
cmake ..
make clean
make -j4 gpt-2 gpt-j gpt-neox mnist mpt replit starcoder whisper
popd
popd


if [ ! -d "ggml-falcon" ]; then
  git clone https://github.com/apage43/ggml.git ggml-falcon
fi
pushd ggml-falcon
git checkout falcon
git pull
mkdir -p build
pushd build
cmake ..
make clean
make -j4 falcon
popd
popd