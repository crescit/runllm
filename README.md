# Prompt

Prompt enables running open-source LLMs optimized for Mac M1 machines with 16GB of memory. 
Its aim is to make LLMs accessible, eliminating the need for expensive 
cloud infrastructure and Nvidia chips. Additionally, it leverages open-source models 
from Huggingface that are proven to perform well on Mac M1s, ensuring a good experience
on common developer hardware.


- [Llama.cpp](https://github.com/ggerganov/llama.cpp)
- [CRD716/ggml-vicuna-1.1-quantized](https://huggingface.co/CRD716/ggml-vicuna-1.1-quantized)

# Usage

## Setup

```
git clone https://github.com/opszero/prompt && cd prompt && ./build.sh
```

# Example

```
cd examples && ./job-post-extract-company-name.sh
```

# Support

<a href="https://www.opszero.com"><img src="https://media.opszero.com/insights/brands/logo/2023/04/26/02/04/12/opsZero_logo.svg" width="300px"/></a>
