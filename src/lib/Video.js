import HTTP from './Http';
import TwilioVideo from 'twilio-video';

export default class Video {

  static generateAccessToken(identity, roomName) {
    const url = "/generate?identity=" + identity + "&room=" + roomName;
    return HTTP.get(url).then(response => {
      return response.data.token;
    });
  }

  static connect(accessToken, roomName) {
    return TwilioVideo.connect(accessToken, {name: roomName});
  }


}
