

// 获取音频播放器对象
var audio = document.getElementById('audioTag');

// 歌曲名
var musicTitle = document.getElementById('music-title');
// 歌曲作者
var author = document.getElementById('author-name');
// 歌曲海报
var recordImg = document.getElementById('record-img');

// 进度条
var progress = document.getElementById('progress');
// 总进度条
var progressTotal = document.getElementById('progress-total');

// 已进行时长
var playedTime = document.getElementById('playedTime');
// 总时长
var audioTime = document.getElementById('audioTime');

// 播放模式按钮
var mode = document.getElementById('playMode');
// 上一首
var skipForward = document.getElementById('skipForward');
// 暂停按钮
var pause = document.getElementById('playPause');
// 下一首
var skipBackward = document.getElementById('skipBackward');
// 音量调节
var volume = document.getElementById('volume');
// 音量调节滑块
var volumeTogger = document.getElementById('volumn-togger');


// 倍速
var speed = document.getElementById('speed');
// 列表
var list = document.getElementById('list');
// 左侧关闭面板
var closeList = document.getElementById('close-list');
// 音乐列表面板
var musicList = document.getElementById('music-list');

// 暂停/播放功能实现
pause.onclick = function (e) {
    if (audio.paused) {
        audio.play();
        rotateRecord();
        pause.classList.remove('icon-play');
        pause.classList.add('icon-pause');
    } else {
        audio.pause();
        rotateRecordStop();
        pause.classList.remove('icon-pause');
        pause.classList.add('icon-play');
    }
}

// 更新进度条
audio.addEventListener('timeupdate', updateProgress); // 监听音频播放时间并更新进度条
function updateProgress() {
    var value = audio.currentTime / audio.duration;
    progress.style.width = value * 100 + '%';
    playedTime.innerText = transTime(audio.currentTime);
}

//音频播放时间换算
function transTime(value) {
    var time = "";
    var h = parseInt(value / 3600);
    value %= 3600;
    var m = parseInt(value / 60);
    var s = parseInt(value % 60);
    if (h > 0) {
        time = formatTime(h + ":" + m + ":" + s);
    } else {
        time = formatTime(m + ":" + s);
    }

    return time;
}

// 格式化时间显示，补零对齐
function formatTime(value) {
    var time = "";
    var s = value.split(':');
    var i = 0;
    for (; i < s.length - 1; i++) {
        time += s[i].length == 1 ? ("0" + s[i]) : s[i];
        time += ":";
    }
    time += s[i].length == 1 ? ("0" + s[i]) : s[i];

    return time;
}

// 点击进度条跳到指定点播放
progressTotal.addEventListener('mousedown', function (event) {
    // 只有音乐开始播放后才可以调节，已经播放过但暂停了的也可以
    if (!audio.paused || audio.currentTime != 0) {
        var pgsWidth = parseFloat(window.getComputedStyle(progressTotal, null).width.replace('px', ''));
        var rate = event.offsetX / pgsWidth;
        audio.currentTime = audio.duration * rate;
        updateProgress(audio);
    }
});

// 点击列表展开音乐列表
list.addEventListener('click', function (event) {
    musicList.classList.remove("list-card-hide");
    musicList.classList.add("list-card-show");
    musicList.style.display = "flex";
    closeList.style.display = "flex";
    closeList.addEventListener('click', closeListBoard);
});

// 点击关闭面板关闭音乐列表
function closeListBoard() {
    musicList.classList.remove("list-card-show");
    musicList.classList.add("list-card-hide");
    closeList.style.display = "none";
}


// 后台音乐列表   length = 19
let musicName = [['阿拉斯加海湾（治愈女声）'], ['用情（走心治愈版）'], ['永不失联的爱'], ['可以不走吗'], ['melody（翻自 ZIVKIPES）'],   // 5
				['唉（原唱：王靖雯）（治愈女版）'], ['边界（治愈版）'], ['给电影人的情书（单依纯版 御音走心）'], ['孤陋寡闻（治愈走心版）'],  // 4
				['红色高跟鞋'],['虎口脱险（治愈女版）'], ['寂寞的季节（治愈版）'], ['哭砂（走心治愈版）'], ['蔓珠莎华（抒情版）'],      // 5
				['你不知道的事（温御走心版）'],['陪你度过漫长岁月（治愈版）'], ['平凡天使（翻自 邓紫棋）'], ['巧克力'], ['倾城（走心治愈版）']];  // 5

// 存储当前播放的音乐序号
var musicId = Math.floor(Math.random() * (musicName.length - 1)) + 0;

//读取fileService中音频信息
let fileList = '';
var createMusicList;
$.ajax({
			type: 'get',
			url: "https://heiyu707.cn/fileServer/findAudioJSON",
			dataType: "json",
			success: function(res) {
				fileList = res;
				if (fileList.length > 0) {
            		musicId = Math.floor(Math.random() * (fileList.length - 1)) + 0;
            		musicName = new Array(fileList.length);
					musicName[musicId] = fileList[musicId].oldFileName.replace(fileList[musicId].ext,'').split('-')[1];          		
            	}
			},
            complete: function (data) { // 请求完成时调用，无论请求失败或成功。
                initMusic();
				if (fileList.length > 0) {
            		for (let i = 0; i < fileList.length; i++) {
            			musicName[i] = fileList[i].oldFileName.replace(fileList[i].ext,'').split('-')[1];
						createMusicListDiv(i);
            		}
            		
            	} else {
					for (let i = 0; i < musicName.length; i++) {
						createMusicListDiv(i);
					}
				}

            }
		})

// 初始化音乐
function initMusic() {
	if (fileList.length > 0) {
		audio.src = "music/"+fileList[musicId].newFileName;
	} else {
		audio.src = "localmusic/music" + musicId.toString() + ".mp3";
	}
    audio.load();
    recordImg.classList.remove('rotate-play');
    audio.ondurationchange = function () {
        musicTitle.innerText = musicName[musicId];
        author.innerText = "晴柠柒";
        audioTime.innerText = transTime(audio.duration);
        // 重置进度条
        audio.currentTime = 0;
        updateProgress();
        refreshRotate();
    }
}
// initMusic();



// 初始化并播放
function initAndPlay() {
    initMusic();
    pause.classList.remove('icon-play');
    pause.classList.add('icon-pause');
    audio.play();
    rotateRecord();
}


// 播放模式设置
var modeId = 3;
mode.addEventListener('click', function (event) {
    modeId = modeId + 1;
    if (modeId > 3) {
        modeId = 1;
    }
    mode.style.backgroundImage = "url('img/mode" + modeId.toString() + ".png')";
});
audio.onended = function () {
    if (modeId == 2) {
        // 跳转至下一首歌
        musicId = (musicId + 1) % musicName.length;
    }
    else if (modeId == 3) {
        // 随机生成下一首歌的序号
        var oldId = musicId;
        while (true) {
            musicId = Math.floor(Math.random() * (musicName.length - 1)) + 0;
            if (musicId != oldId) { break; }
        }
    }
    initAndPlay();
}

// 上一首
skipForward.addEventListener('click', function (event) {
    musicId = musicId - 1;
    if (musicId < 0) {
        musicId = musicName.length - 1;
    }
    initAndPlay();
});

// 下一首
skipBackward.addEventListener('click', function (event) {
    musicId = musicId + 1;
    if (musicId > musicName.length - 1) {
        musicId = 0;
    }
    initAndPlay();
});

// 倍速功能（这里直接暴力解决了）
speed.addEventListener('click', function (event) {
    var speedText = speed.innerText;
    if (speedText == "1.0X") {
        speed.innerText = "1.5X";
        audio.playbackRate = 1.5;
    }
    else if (speedText == "1.5X") {
        speed.innerText = "2.0X";
        audio.playbackRate = 2.0;
    }
    else if (speedText == "2.0X") {
        speed.innerText = "0.5X";
        audio.playbackRate = 0.5;
    }
    else if (speedText == "0.5X") {
        speed.innerText = "1.0X";
        audio.playbackRate = 1.0;
    }
});


// 刷新唱片旋转角度
function refreshRotate() {
    recordImg.classList.add('rotate-play');
}

// 使唱片旋转
function rotateRecord() {
    recordImg.style.animationPlayState = "running"
}

// 停止唱片旋转
function rotateRecordStop() {
    recordImg.style.animationPlayState = "paused"
}

// 存储上一次的音量
var lastVolumn = 70

// 滑块调节音量
audio.addEventListener('timeupdate', updateVolumn);
function updateVolumn() {
    audio.volume = volumeTogger.value / 100;
}

// 点击音量调节设置静音
volume.addEventListener('click', setNoVolumn);
function setNoVolumn() {
    if (volumeTogger.value == 0) {
        if (lastVolumn == 0) {
            lastVolumn = 70;
        }
        volumeTogger.value = lastVolumn;
        volume.style.backgroundImage = "url('img/音量.png')";
    }
    else {
        lastVolumn = volumeTogger.value;
        volumeTogger.value = 0;
        volume.style.backgroundImage = "url('img/静音.png')";
    }
}


function createMusicListDiv(i) {
	createMusicList = document.createElement("div");			//创建电影栏目div用于保存一个电影信息
	createMusicList.setAttribute("id","music"+i);					//setAttribute() ：方法添加指定的属性，并为其赋指定的值。
	createMusicList.innerHTML = musicName[i];
	createMusicList.style.overflow = "hidden";
	createMusicList.title = musicName[i];
	document.getElementById("all-list").appendChild(createMusicList);
	document.getElementById("music"+i).addEventListener('click', function (event) {
		musicId = i;
		initAndPlay();
	});
}
