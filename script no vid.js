const playlistIDs = [
    "PLUhJyvkLp-rOzDkjrTPHoGtb8wn9-9FCn",
    "PLAYLIST_ID_2",
    "PLAYLIST_ID_3",
    "PLAYLIST_ID_4",
    "PLAYLIST_ID_5"
  ];
  
  const ypt_thumbs = document.getElementById("ypt_thumbs");
  
  let player;
  const ypt_player = document.getElementById("player");
  const nowPlaying = "ypt-now-playing";
  const nowPlayingClass = `.${nowPlaying}`;
  let ypt_index = 0;
  
  function getAllPlaylistsData() {
    for (let i = 0; i < playlistIDs.length; i++) {
      const playlistID = playlistIDs[i];
      getPlaylistData(playlistID);
    }
  }
  
  function getPlaylistData(playlistID, video_list, page_token) {
    const apiKey = "AIzaSyBhCW-Vsv2Vr9cqi_p_2OzYmcAHrwr8rdk";
    let theUrl =
      "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status" +
      `&maxResults=${1000}` +
      `&playlistId=${playlistID}` +
      `&key=${apiKey}`;
  
    if (page_token) {
      theUrl += `&pageToken=${page_token}`;
    }
  
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
  
    xmlHttp.onload = function (e) {
      buildJSON(xmlHttp.responseText, video_list, playlistID);
    };
  }
  
  function buildJSON(response, list) {
    const results = JSON.parse(response);
    if (!list) {
      list = [];
    }
    list.push(...results.items);
  
    if (results.nextPageToken) {
      getPlaylistData(playlistID, list, results.nextPageToken);
    } else {
      buildHTML(list);
    }
  }
  
  function buildHTML(data) {
    data.reverse();
    let list_data = "";
    let lastVideoId = null;
  
    for (let i = 0; i < data.length; i++) {
      const item = data[i].snippet;
  
      if (!item.thumbnails.medium) {
        continue;
      }
  
      let ellipsis = item.title.split("|")[0].length > 50 ? "..." : "";
  
      list_data += `<div class="yt-thumb carousel-cell" data-ypt-index="${i}">
        <div class="yt-single">
          <div class="yt-img">
            <img class="img-fluid" alt="${item.title.replace(/"/g, "'")}" src="${item.thumbnails.medium.url}"/>
          </div>
          <div class="yt-single-description p-3 pt-2">
            <div class="date font-body mb-3">
              <i class="fas fa-calendar-alt me-2"></i><span>${moment(data[i].contentDetails.videoPublishedAt).format("MMMM Do YYYY")}</span>
            </div>
            <h4 class="yt-title">${item.title.split("|")[0].substring(0, 50)}${ellipsis}</h4>
          </div>
        </div>
      </div>`;
  
      if (i === data.length - 1) {
        lastVideoId = item.resourceId.videoId;
      }
    }
  
    ypt_thumbs.innerHTML = list_data;
  
    if (lastVideoId) {
      player.cueVideoById(lastVideoId);
      player.playVideo();
    }
  }
  
  function onPlayerReady(event) {
    // ...
  }
  
  function onPlayerStateChange(event) {
    const currentIndex = player.getPlaylistIndex();
    const the_thumbs = ypt_thumbs.querySelectorAll(".yt-thumb");
    const currentThumb = the_thumbs[currentIndex];
  
    if (event.data === YT.PlayerState.PLAYING) {
      the_thumbs.forEach((thumb) => {
        thumb.classList.remove(nowPlaying);
      });
  
      currentThumb.classList.add(nowPlaying);
    }
  
    if (
      event.data === YT.PlayerState.ENDED &&
      currentIndex === the_thumbs.length - 1 &&
      the_thumbs[currentIndex].classList.contains(nowPlaying)
    ) {
      // jQuery.event.trigger("playlistEnd");
      // Commented out as `playlistEnd` is not defined
    }
  }
  
  function loadYouTubeIframeAPI() {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.querySelector("script");
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
  
  function initializePlayer(playlistID) {
    player = new YT.Player("player", {
      height: "360",
      width: "640",
      playerVars: {
        listType: "playlist",
        list: playlistID,
        autoplay: 0,
        showinfo: 0,
        modestbranding: 0,
        cc_load_policy: 0,
        rel: 0,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });
  }
  
  function initializeFlickity() {
    setTimeout(function () {
      const elem = document.querySelector(".youtube-carousel");
      const flkty = new Flickity(elem, {
        cellAlign: "left",
        wrapAround: true,
        draggable: false,
        pageDots: false,
      });
    }, 1000);
  }
  
  // Load YouTube Iframe API
  loadYouTubeIframeAPI();
  
  // Call the function to fetch data for all playlists
  getAllPlaylistsData();
  
  // Delay initialization of player and Flickity
  setTimeout(function () {
    const lastPlaylistID = playlistIDs[playlistIDs.length - 1];
    initializePlayer(lastPlaylistID);
    initializeFlickity();
  }, 2000);
  






// var tag = document.createElement("script");
// tag.src = "https://www.youtube.com/iframe_api";
// var firstScriptTag = document.getElementsByTagName("script")[0];
// firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// var player;
// var ypt_player = document.getElementById("player");

// var playlistID = 'PLUhJyvkLp-rOzDkjrTPHoGtb8wn9-9FCn';
// var ypt_thumbs = document.getElementById("ypt_thumbs");
// var nowPlaying = "ypt-now-playing";
// var nowPlayingClass = "." + nowPlaying;
// var ypt_index = 0;

// function getPlaylistData(playlistID, video_list, page_token) {
//     var apiKey = "AIzaSyBhCW-Vsv2Vr9cqi_p_2OzYmcAHrwr8rdk";
//     var theUrl =
//         "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status" +
//         "&maxResults=" +
//         1000 +
//         "&playlistId=" +
//         playlistID +
//         "&key=" +
//         apiKey;
//     if (page_token) {
//         theUrl += "&pageToken=" + page_token;
//     }
//     var xmlHttp = null;
//     xmlHttp = new XMLHttpRequest();
//     xmlHttp.open("GET", theUrl, true);
//     xmlHttp.send(null);
//     xmlHttp.onload = function (e) {
//         buildJSON(xmlHttp.responseText, video_list, playlistID);
//     };
// }

// function buildJSON(response, list, playlistID) {
//     var results = JSON.parse(response);
//     if (!list) {
//         list = [];
//     }
//     list.push.apply(list, results.items);
//     if (results.nextPageToken) {
//         getPlaylistData(playlistID, list, results.nextPageToken);
//     } else {
//         buildHTML(list);
//     }
// }

// function buildHTML(data) {
//     data.reverse();
//     var list_data = "";
//     var lastVideoId = null;
//     for (i = 0; i < data.length; i++) {
//         var item = data[i].snippet;
//         if (!item.thumbnails.medium) {
//             continue;
//         }
//         if (item.title.split("|")[0].length > 50) {
//             ellipsis = "...";
//         } else {
//             ellipsis = "";
//         }
//         list_data +=
//             '<div class="yt-thumb carousel-cell" data-ypt-index="' +
//             i +
//             '"><div class="yt-single"><div class="yt-img"><img class="img-fluid" alt="' +
//             item.title.replace(/"/g, "'") +
//             '" src="' +
//             item.thumbnails.medium.url +
//             '"/></div><div class="yt-single-description p-3 pt-2"><div class="date font-body mb-3"><i class="fas fa-calendar-alt me-2"></i></i><span>' +
//             moment(data[i].contentDetails.videoPublishedAt).format("MMMM Do YYYY") +
//             '</span></div><h4 class="yt-title">' +
//             item.title.split("|")[0].substring(0, 50) +
//             ellipsis +
//             "</h4></div></div></div>";
//         if (i === data.length - 1) {
//             lastVideoId = item.resourceId.videoId;
//         }
//     }
//     ypt_thumbs.innerHTML = list_data;
//     if (lastVideoId) {
//         player.cueVideoById(lastVideoId);
//         player.playVideo();
//     }
// }

// function onPlayerReady(event) {
//     // ...
// }

// getPlaylistData(playlistID);

// window.onYouTubeIframeAPIReady = function () {
//     player = new YT.Player("player", {
//         height: "360",
//         width: "640",
//         playerVars: {
//             listType: "playlist",
//             list: playlistID,
//             autoplay: 0,
//             showinfo: 0,
//             modestbranding: 0,
//             cc_load_policy: 0,
//             rel: 0
//         },
//         events: {
//             onReady: onPlayerReady,
//             onStateChange: onPlayerStateChange
//         }
//     });

//     function onPlayerStateChange(event) {
//         var currentIndex = player.getPlaylistIndex();
//         var the_thumbs = ypt_thumbs.getElementsByClassName("yt-thumb");
//         var currentThumb = the_thumbs[currentIndex];

//         if (event.data == YT.PlayerState.PLAYING) {
//             for (var i = 0; i < the_thumbs.length; i++) {
//                 the_thumbs[i].className = "yt-thumb carousel-cell";
//             }
//             currentThumb.className = "yt-thumb carousel-cell " + nowPlaying;
//         }

//         if (
//             event.data == YT.PlayerState.ENDED &&
//             currentIndex == the_thumbs.length - 1 &&
//             the_thumbs[currentIndex].className == nowPlaying
//         ) {
//             jQuery.event.trigger("playlistEnd");
//         }
//     }

//     jQuery(document).on("click", '[data-ypt-index]:not(".ypt-now-playing")', function (e) {
//         ypt_index = Number(jQuery(this).attr("data-ypt-index"));
//         if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
//             player.cuePlaylist({
//                 listType: "playlist",
//                 list: playlistID,
//                 index: ypt_index,
//                 suggestedQuality: "hd720"
//             });
//         } else {
//             player.playVideoAt(ypt_index);
//         }
//         jQuery(nowPlayingClass).removeClass(nowPlaying);
//     });
// };

// setTimeout(function () {
//     var elem = document.querySelector(".youtube-carousel");
//     var flkty = new Flickity(elem, {
//         cellAlign: "left",
//         wrapAround: true,
//         draggable: false,
//         pageDots: false
//     });
// }, 1000);
