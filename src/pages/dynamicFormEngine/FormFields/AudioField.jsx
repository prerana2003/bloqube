import { Box, IconButton, Typography } from "@mui/material";
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useField, useFormikContext } from "formik";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { bloqcibeApi, usePlayConsentAudioMutation } from "../../../store/slices/apiSlice";
import AudioModal from "../../../components/common/AudioModal";

const AudioField = (props) => {
    const { name, audioText } = props;
    const [field, meta] = useField(name);
    const { setFieldValue } = useFormikContext();
    // const [playConsentAudio, { data: mp3Blob, isLoading }] =
    //     bloqcibeApi.endpoints.playConsentAudio.useLazyQuery();
    const [playConsentAudio] = usePlayConsentAudioMutation();
    const [mp3Url, setMp3Url] = useState();
    const [audioModalOpen, setAudioModalOpen] = useState(false);
    const consentLanguage = useSelector((state) => state.subject.consentLanguage);
    const token1 = useSelector((state) => state.auth.token);
    useEffect(() => {
        setMp3Url(null);
    }, [consentLanguage])
    const fetchAudioAsBlob = async (url) => {
        try {
            const response = await fetch(url, {
                headers: { Authorization: `Bearer ${token1.access_token}`, 'Content-Type': 'application/json' },
                method: 'POST',
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                body: JSON.stringify({
                    textToTranslate: audioText ? audioText : 'Audio not available',
                    targetLanguageCode: consentLanguage
                })
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const blob = await response.blob(); // Convert the response to a Blob
            return blob;
        } catch (error) {
            console.error("Failed to fetch audio: ", error);
            return null;
        }
    };
    const startSound = async () => {
        setFieldValue(name, true);
        fetchAudioAsBlob(`${process.env.REACT_APP_API_ENDPOINT_URL}e-consent/subject/consent/synthesizeSpeech`).then(blob => {
            if (blob) {
                const audioUrl = URL.createObjectURL(blob);
                // Use audioUrl as the src for an audio element, for example
                setAudioModalOpen(true)
                setMp3Url(audioUrl)
            }
        });
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton disabled={props.disabled} sx={{ backgroundColor: '#F5F3F7', color: field.value ? '#198F51' : '#ff6600'}} size="large" onClick={startSound}>
                <VolumeUpIcon />
            </IconButton>
            {mp3Url && audioModalOpen && (
                // <audio controls>
                //     <source src={mp3Url} type="audio/mpeg" />
                //     Your browser does not support the audio element.
                // </audio>
                <AudioModal open={audioModalOpen} onClose={() => setAudioModalOpen(false)} audioSrc={mp3Url} />
            )}
        </Box>);
}

export default AudioField;