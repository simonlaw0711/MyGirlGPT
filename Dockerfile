# start from runpod pytorch container
ARG BASE_IMAGE=simon0711/mygirlgpt:init

FROM ${BASE_IMAGE} as dev-base

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ENV DEBIAN_FRONTEND noninteractive\

SHELL=/bin/bash

WORKDIR /MyGirlGPT/opendan-text-generation-webui
RUN pip install -r requirements.txt

WORKDIR /MyGirlGPT
ADD docker/start_opendan_textgen_server.sh /MyGirlGPT/start_opendan_textgen_server.sh
ADD docker/start_opendan_tts_server.sh /MyGirlGPT/start_opendan_tts_server.sh
ADD docker/start_telegram_bot.sh /MyGirlGPT/start_telegram_bot.sh
ADD docker/start.sh /start.sh

RUN chmod +x /MyGirlGPT/start_opendan_textgen_server.sh
RUN chmod +x /MyGirlGPT/start_opendan_tts_server.sh
RUN chmod +x /MyGirlGPT/start_telegram_bot.sh
RUN chmod +x /start.sh

CMD [ "/start.sh" ]