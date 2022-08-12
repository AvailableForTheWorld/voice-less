// create Agora client
var client = AgoraRTC.createClient({mode: "live", codec: "vp8"});
AgoraRTC.enableLogUpload();
var localTracks = {
    videoTrack: null,
    audioTrack: null
};
var remoteUsers = {};
// Agora client options
var options = {
    appid: null,
    channel: null,
    uid: null,
    token: null,
    role: "audience", // host or audience
    audienceLatency: 2
};

let audioCtx = new AudioContext();

// let bufAudioTrack = AgoraRTC.createBufferSourceAudioTrack({
//     source: file,
// });

// Stereo
var channels = 2;

// Create an empty two second stereo buffer at the
// sample rate of the AudioContext
var frameCount = audioCtx.sampleRate * 2.0;
var myArrayBuffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);


// the demo can auto join channel with params in url
$(() => {
    var urlParams = new URL(location.href).searchParams;
    options.appid = urlParams.get("appid");
    options.channel = urlParams.get("channel");
    options.token = urlParams.get("token");
    options.uid = urlParams.get("uid");
    if (options.appid && options.channel) {
        $("#uid").val(options.uid);
        $("#appid").val(options.appid);
        $("#token").val(options.token);
        $("#channel").val(options.channel);
        $("#join-form").submit();
    }
})

$("#host-join").click(function (e) {
    options.role = "host"
})

$("#lowLatency").click(function (e) {
    options.role = "audience"
    options.audienceLatency = 1
    $("#join-form").submit()
})

$("#ultraLowLatency").click(function (e) {
    options.role = "audience"
    options.audienceLatency = 2
    $("#join-form").submit()
})

$("#join-form").submit(async function (e) {
    e.preventDefault();
    $("#host-join").attr("disabled", true);
    $("#audience-join").attr("disabled", true);
    try {
        options.appid = $("#appid").val();
        options.token = $("#token").val();
        options.channel = $("#channel").val();
        options.uid = Number($("#uid").val());
        await join();
        if (options.role === "host") {
            $("#success-alert a").attr("href", `index.html?appid=${options.appid}&channel=${options.channel}&token=${options.token}`);
            if (options.token) {
                $("#success-alert-with-token").css("display", "block");
            } else {
                $("#success-alert a").attr("href", `index.html?appid=${options.appid}&channel=${options.channel}&token=${options.token}`);
                $("#success-alert").css("display", "block");
            }
        }
    } catch (error) {
        console.error(error);
    } finally {
        $("#leave").attr("disabled", false);
    }
})

$("#leave").click(function (e) {
    leave();
})

async function join() {
    // create Agora client

    if (options.role === "audience") {
        client.setClientRole(options.role, {level: options.audienceLatency});
        // add event listener to play remote tracks when remote user publishs.
        client.on("user-published", handleUserPublished);
        client.on("user-unpublished", handleUserUnpublished);
    }
    else{
        client.setClientRole(options.role);
    }

    // join the channel
    options.uid = await client.join(options.appid, options.channel, options.token || null, options.uid || null);

    if (options.role === "host") {
        // create local audio and video tracks
        localTracks.audioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        localTracks.videoTrack = await AgoraRTC.createCameraVideoTrack();
        // play local video track
        localTracks.videoTrack.play("local-player");
        $("#local-player-name").text(`localTrack(${options.uid})`);

        // 创建音频回调
        localTracks.audioTrack.setAudioFrameCallback( (buffer) => {
            for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
              // Float32Array with PCM data
              const currentChannelData = buffer.getChannelData(channel);              
              // console.log("PCM data in channel", channel, currentChannelData);
            }
          }, 2048);
          
        // 停止音频回调
        // localTracks.audioTrack.setAudioFrameCallback(null);

        const bufferAudioOptions = {
            "cacheOnlineFile":true,
            "encoderConfig":"",
            "source": currentChannelData,
        };

        // Get an AudioBufferSourceNode.
        // This is the AudioNode to use when we want to play an AudioBuffer
        var source = audioCtx.createBufferSource(bufferAudioOptions);

        // set the buffer in the AudioBufferSourceNode
        source.buffer = currentChannelData;

        // connect the AudioBufferSourceNode to the
        // destination so we can hear the sound
        source.connect(audioCtx.destination);

        // start the source playing
        source.start();

        source.onended = () => {
            console.log("White noise finished.");
          };

        //create the mirror of local player
        $("#local-player-mirror-area").show();
        var mirrorPlayer = document.getElementById("local-player-mirror-video-track");

        //get browser-native object MediaStreamTrack from WebRTC SDK
        const msTrack = localTracks.videoTrack.getMediaStreamTrack();
        //generate browser-native object MediaStream with above video track
        const ms = new MediaStream([msTrack])
        mirrorPlayer.srcObject = ms;
        mirrorPlayer.play();

        // publish local tracks to channel
        await client.publish(Object.values(localTracks));
        console.log("publish success");
    }
}



async function leave() {
    for (trackName in localTracks) {
        var track = localTracks[trackName];
        if (track) {
            track.setAudioFrameCallback(null);
            track.stop();
            track.close();
            localTracks[trackName] = undefined;
        }
    }

    // remove remote users and player views
    remoteUsers = {};
    $("#remote-playerlist").html("");

    // leave the channel
    await client.leave();

    $("#local-player-name").text("");
    $("#host-join").attr("disabled", false);
    $("#audience-join").attr("disabled", false);
    $("#leave").attr("disabled", true);
    $(".video-mirror").hide();
    console.log("client leaves channel success");
}

async function subscribe(user, mediaType) {
    const uid = user.uid;
    // subscribe to a remote user
    await client.subscribe(user, mediaType);
    console.log("subscribe success");
    if (mediaType === 'video') {
        const player = $(`
      <div id="player-wrapper-${uid}">
        <p class="player-name">remoteUser(${uid})</p>
        <div id="player-${uid}" class="player"></div>
        <p class="player-name">Video Mirror</p>
        <div id="player-${uid}-mirror-area" class="player" style="border: 2px dashed red ;">
            <div style="width: 100%; height: 100%; position: relative; overflow: hidden; background-color: black;">
                <video id="video_track-video-${uid}-mirror" 
                    class="agora_video_player" playsinline="" muted="" 
                    style="width: 100%; height: 100%; position: absolute; left: 0px; top: 0px; object-fit: contain;">
                </video>
            </div>
        </div>
      </div>
    `);
        $("#remote-playerlist").append(player);
        user.videoTrack.play(`player-${uid}`, {fit:"contain"});

        //handling the mirror video
        $(`#player-${uid}-mirror-area`).show();
        var mirrorRemotePlayer = document.getElementById(`video_track-video-${uid}-mirror`);
        //get browser-native object MediaStreamTrack from WebRTC SDK
        const msTrack = user.videoTrack.getMediaStreamTrack();
        //generate browser-native object MediaStream with above video track
        const ms = new MediaStream([msTrack])
        mirrorRemotePlayer.srcObject = ms;
        mirrorRemotePlayer.play();
    }
    if (mediaType === 'audio') {
        user.audioTrack.play();
    }
}

function handleUserPublished(user, mediaType) {
    const id = user.uid;
    remoteUsers[id] = user;
    subscribe(user, mediaType);
}

function handleUserUnpublished(user, mediaType) {
    if (mediaType === 'video') {
        const id = user.uid;
        delete remoteUsers[id];
        $(`#player-wrapper-${id}`).remove();
    }
}
