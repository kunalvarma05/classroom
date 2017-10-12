import HTTP from './Http';
import TwilioVideo from 'twilio-video';

export default class Video {

  static generateAccessToken(identity, roomName) {
    const url = "/generate?identity=" + identity + "&room=" + roomName;
    return HTTP.get(url).then(response => {
      return response.data.token;
    });
  }

  static connect(accessToken, roomName, video = false, audio = true) {
    return new Promise((resolve, reject) => {
      // Get the Tracks
      Video.getTracks({audio: audio, video: video}).then((localTracks) => {
        const connection = TwilioVideo.connect(accessToken, {
          name: roomName,
          tracks: localTracks
        });

        // Resolve
        resolve(connection);
      }).catch(e => {
        reject(e);
      });
    });
  }

  static getTracks(options = {}) {
    return new Promise((resolve, reject) => {
      TwilioVideo.createLocalTracks(options).then((tracks) => {
        resolve(tracks);
      });
    })
  }

  static getLocalVideoTrack(options = {}) {
    return new Promise((resolve, reject) => {
      TwilioVideo.createLocalVideoTrack(options).then((track) => {
        resolve(track);
      });
    })
  }

}
