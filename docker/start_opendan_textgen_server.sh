#!/bin/bash

cd /MyGirlGPT/opendan-text-generation-webui
nohup python server.py --listen --chat --character Cherry --extensions openai  --model cognitivecomputations_WizardLM-13B-Uncensored > textgen.log &