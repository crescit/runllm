# pre-req
python, go, js, and all the dependencies this will install
in the future would probably just separate out the llm piece to either chat gpt or a server but for now this is free

1) Run build.sh to get llama installed

# What's in the box?

## 1) (llm folder, further instructions for that in there) A llm which is prompted via server in langchain folder 
## 2) (api-gateway folder) A Go server which writes to a postgres table 
   2a) TODO - build endpoint which sends audio to speech-to-text
   2b) build endpoint that sends back hals response, questions are generated when we ingest job description could cache those and some popular questions
   2c) store users response to questions in text 
## 3) a docker-compose file that spins up the go server and runs the postgres migrations and the nginx stuff to get the routing working on localhost and get you inited
## 4) (lang-chain folder) langchain  
   4a) DONE server.py builds the faiss embedding which the llama model loads 
   4b) DONE chat.py talks to the llm with the fresh faiss database and prompt and then calls api-gateway with the questions 
## 5) (webapp folder) a basic nextjs web-app 
  Needed functionality:
  5a) DONE HAL (to be replaced with anime girl) basic red dot which has a speech bubble with the text
  5b) DONE mic access to allow for user to speak 
  5c) DONE a way to ingest the job description (we want to process this with 4)
  5d) (not a priority for proof of concept but backend logic allows for it) user login 
  5e) getting questions back from database
  5f) initializing the interview on the backend and passing that to langchain server 
  
## 6) What's left that's not already in the box?
  60) DONE Speech-to-text (you talking to hal)
  6a) (not a priority rn) Text-to-speech model (hal talking to you)
  6b) (not a priority rn) video 
