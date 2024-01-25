#!/bin/bash

cd /MyGirlGPT/opendan-text-generation-webui
nohup python server.py --listen --chat --character Cherry --extensions openai --model MediaTek-Research_Breeze-7B-Instruct-v0_1 > textgen.log &