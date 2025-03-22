import { AccessToken } from 'livekit-server-sdk';
import livekitConfig from './livekitConfig';

export const createLiveKitRoom = async () => {
  try {
    const roomName = `room-${Date.now()}`; // Generate a unique room name
    const token = new AccessToken(livekitConfig.apiKey, livekitConfig.apiSecret, {
      identity: `admin-${Date.now()}`,
    });

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
    });

    const tokenString = token.toJwt();
    const streamUrl = `${livekitConfig.url}/?access_token=${tokenString}`;

    console.log('LiveKit Room Created:', roomName);
    console.log('Stream URL:', streamUrl);

    return streamUrl; // Return the stream URL
  } catch (error) {
    console.error('Error creating LiveKit room:', error);
    throw error;
  }
};

export const createLiveKitStreamKey = async () => {
  try {
    const roomName = `room-${Date.now()}`; // Generate a unique room name
    const token = new AccessToken(livekitConfig.apiKey, livekitConfig.apiSecret, {
      identity: `streamer-${Date.now()}`,
    });

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
    });

    const streamKey = token.toJwt(); // Use the token as the stream key
    const streamUrl = `${livekitConfig.url}/rtmp`; // Ensure this is the RTMP endpoint for LiveKit

    console.log('Stream Key:', streamKey);
    console.log('Stream URL:', streamUrl);

    return { streamUrl, key: { server: streamUrl, key: streamKey } }; // Return server and key
  } catch (error) {
    console.error('Error generating stream key:', error);
    throw error;
  }
};

export const generateStreamKey = async () => {
  const roomName = `room-${Date.now()}`;
  const token = new AccessToken(livekitConfig.apiKey, livekitConfig.apiSecret, {
    identity: `streamer-${Date.now()}`,
  });

  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
  });

  const streamKey = token.toJwt();
  const rtmpUrl = `${livekitConfig.url}/rtmp`;

  return { server: rtmpUrl, key: streamKey };
};
