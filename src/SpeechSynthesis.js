import React, { useEffect, useState } from "react";
import Speech from "speak-tts";
import { Button, Select, MenuItem, TextField, Typography, Box } from "@mui/material";

const SpeechSynthesis = () => {
  const [speech, setSpeech] = useState(null);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");
  const [text, setText] = useState("");
  const [supportMessage, setSupportMessage] = useState("");

  useEffect(() => {
    const speechInstance = new Speech();
    speechInstance
      .init({
        volume: 0.5,
        lang: "en-GB",
        rate: 1,
        pitch: 1,
        listeners: {
          onvoiceschanged: (voicesList) => {
            console.log("Voices changed", voicesList);
            setVoices(voicesList);
          },
        },
      })
      .then((data) => {
        console.log("Speech is ready", data);
        setVoices(data.voices);
        setSpeech(speechInstance);
      })
      .catch((e) => {
        console.error("An error occurred while initializing : ", e);
      });

    const browserSupportMessage = speechInstance.hasBrowserSupport()
      ? ""
      : "Your browser does NOT support speech synthesis. Try using Chrome or Safari instead!";
    setSupportMessage(browserSupportMessage);
  }, []);

  const handleSpeak = () => {
    if (speech) {
      if (selectedVoice) {
        const voice = voices.find((v) => v.name === selectedVoice);
        speech.setLanguage(voice.lang);
        speech.setVoice(selectedVoice);
      }
      speech
        .speak({
          text,
          queue: false,
          listeners: {
            onstart: () => console.log("Start utterance"),
            onend: () => console.log("End utterance"),
            onresume: () => console.log("Resume utterance"),
            onboundary: (event) =>
              console.log(
                `${event.name} boundary reached after ${event.elapsedTime} milliseconds.`
              ),
          },
        })
        .then((data) => console.log("Success !", data))
        .catch((e) => console.error("An error occurred :", e));
    }
  };

  const handlePause = () => {
    speech && speech.pause();
  };

  const handleResume = () => {
    speech && speech.resume();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Available Voices</Typography>
      <Select
        value={selectedVoice}
        onChange={(e) => setSelectedVoice(e.target.value)}
        fullWidth
        displayEmpty
        sx={{ mb: 2 }}
      >
        <MenuItem value="">autodetect language</MenuItem>
        {voices.map((voice) => (
          <MenuItem key={voice.name} value={voice.name}>
            {voice.name} ({voice.lang})
          </MenuItem>
        ))}
      </Select>

      <TextField
        id="text"
        label="Text to Speak"
        multiline
        rows={4}
        variant="outlined"
        value={text}
        onChange={(e) => setText(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Box sx={{ display: "flex", gap: 1 }}>
        <Button variant="contained" color="primary" onClick={handleSpeak}>
          Play
        </Button>
        <Button variant="contained" color="secondary" onClick={handlePause}>
          Pause
        </Button>
        <Button variant="contained" color="success" onClick={handleResume}>
          Resume
        </Button>
      </Box>

      <Typography variant="body1" sx={{ mt: 2 }}>
        {supportMessage}
      </Typography>
    </Box>
  );
};

export default SpeechSynthesis;
