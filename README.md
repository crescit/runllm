# pre-req
python, go, js, and all the dependencies this will install
in the future would probably just separate out the llm piece to either chat gpt or a server but for now this is free

1) Run build.sh to get llama installed

# What's in the box?

## 1) A llm which is prompted by a go server whenever you want to talk to it with a web agent (installed via build.sh)
## 2) A Go server running an endpoint that takes in a basic prompt
   2a) TODO - build endpoint which sends audio to speech-to-text
   2b) build endpoint that sends back hals response, questions are generated when we ingest job description could cache those and some popular questions
   2c) store users response to questions in text 
   
## 4) fileloader.py - loads in a file from your local directory currently pointing to "resumes" and builds a vector database which can be passed to the llm
   4a) Have this for allowing users to upload job requirements and running langchain on this since running a llm for everything is slow and expensive
   4aa) since we get this thing to build vector databases we can keep the lllm with fresh information about roles 
   4b) TODO - requirements.txt for sharing python dependencies 
## 5) a basic nextjs web-app 
  Needed functionality: (make this all one page?)
  5a) HAL (to be replaced with anime girl) basic red dot which has a speech bubble with the text
  5b) mic access to allow for user to speak 
  5c) a way to ingest the job description (we want to process this with 4)
  
## 6) What's left that's not already in the box?
  60) Speech-to-text (you talking to hal)
  6a) Text-to-speech model (hal talking to you)
  6b) video 

# below is the readme from the repo i pulled for getting the llms running quickly it was MIT license so we are good

# Prompt

Prompt enables running open-source LLMs optimized for Mac M1 machines with 16GB
of memory. Its aim is to make LLMs accessible, eliminating the need for
expensive cloud infrastructure and Nvidia chips. Additionally, it leverages
open-source models from Huggingface that are proven to perform well on Mac M1s,
ensuring a good experience on common developer hardware.

Built on top of:

- [Llama.cpp](https://github.com/ggerganov/llama.cpp)
- [ggml](https://github.com/ggerganov/ggml)

# Usage

## Setup

```
git clone https://github.com/opszero/prompt && cd prompt && ./build.sh
```

# Example

## WizardLM

- [TheBloke/WizardLM-7B-V1.0-Uncensored-GGML](https://huggingface.co/TheBloke/WizardLM-7B-V1.0-Uncensored-GGML/resolve/main/wizardlm-7b-v1.0-uncensored.ggmlv3.q4_1.bin) - Noncommercial
- [TheBloke/WizardLM-13B-V1.0-Uncensored-GGML](https://huggingface.co/TheBloke/WizardLM-13B-V1.0-Uncensored-GGML/resolve/main/wizardlm-13b-v1.0-uncensored.ggmlv3.q4_1.bin)

```
cd examples
./job-post-extract-company-name-wizardlm-7b.sh
./job-post-extract-company-name-wizardlm-13b.sh
```

## Vicuna

- [CRD716/ggml-vicuna-1.1-quantized](https://huggingface.co/CRD716/ggml-vicuna-1.1-quantized) - Noncommercial

```
cd examples && ./job-post-extract-company-name-vicuna-7b.sh
```

## MPT5

- [TheBloke/MPT-7B-Instruct-GGM](https://huggingface.co/TheBloke/MPT-7B-Instruct-GGML) - Commercial

```
cd examples && ./job-post-extract-company-name-mpt5-7b.sh
```

## Falcon

- [RachidAR/falcon-7B-ggml](https://huggingface.co/RachidAR/falcon-7B-ggml) - Commerical

```
cd examples && ./job-post-extract-company-name-falcon-7b.sh
```

# Support

<a href="https://www.opszero.com"><img src="https://media.opszero.com/insights/brands/logo/2023/04/26/02/04/12/opsZero_logo.svg" width="300px"/></a>
