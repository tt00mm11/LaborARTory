// ローディングの変数
let isLoading = true;
let assetNumber = 2;
let assetCounter = 0;

// キャンバスサイズ、図形サイズの基準を決める変数
let winSize;

// 背景の色を決める変数（透明度設定なし、あり）
let color1, color2;

// 図形の色彩を決める変数
let Hue1 = 0;
let Hue2 = 0;

// サウンドデータを入れる変数
let theSound = [];

// ビジュアライザーの数（追加した場合、数を増やす）
let playModeNum = 25;

// サウンドモードの変数
let soundMode = 0;

// プレイモードの変数
let playMode = 0;

// タップの数を数える変数
let tapCounter = 0;

// soundVisualizerで使うデータの変数
let spectrum, waveform, volume, time;

let mic, recorder, soundFile, metronome, rec;
const mixingFile = [];
let state = 0;

let mixingNumber = 0;

let currentTempo = 128;

let parent = document.getElementById('content');
let uploadSound = document.getElementById('import_input_i');

let count = 9;

uploadSound.addEventListener('change', changeSound, false);

function changeSound() {
    theSound[0] = loadSound(this.files[0]);
    // サウンドの初期化
    theSound[0].stop();
    theSound[0].setVolume(0.5);
}

// データをロード
function loadAsset() {
// テキストフォントを設定
textFont('Megrim');

// サウンドデータをロードする
    // theSound[0] = loadSound('../audio/claploop4.mp3');
}

// 初期化
function setup() {
    theSound[1] = loadSound('../audio/low.mp3');
    // p5.AudioInオブジェクトを作成
    mic = new p5.AudioIn();
    // p5.SoundRecorderオブジェクトを作成
    recorder = new p5.SoundRecorder();
    // ensure audio is enabled
    userStartAudio();
    // オーディオ入力処理を開始
    mic.start();
    // マイクをレコーダーに接続
    recorder.setInput(mic);
    // 空のp5.SoundFileオブジェクトを作成。録音した音の再生に使用する
    soundFile = new p5.SoundFile();
    mixingFile[0] = new p5.SoundFile();
    Hue1 = int(random(1, 360));


// 画面サイズの縦横を比較し、小さい値をキャンバスサイズに設定
winSize = min(500, 500);
let canvas = createCanvas(winSize, winSize);

    canvas.parent(parent);

// 解像度
pixelDensity(2);

// 色の計算方法をHSB（色相、彩度、明度、透明度）に設定
colorMode(HSB, 360, 100, 100, 100);

// データをロードする
loadAsset();

// 角度の計算方法を「度」に設定
angleMode(DEGREES);

// 四角形の基準を真ん中に設定
rectMode(CENTER);

// 背景色の設定 #1C0E57
color1 = color(252, 84, 34);
color2 = color(72, 100, 100,);

// 周波数を解析
fft = new p5.FFT(0.9, 512);

// 音量を測定
    amplitude = new p5.Amplitude();

}

// タップ（クリック）して、プレイモードを決める
function touchStarted(event) {
    console.log(event);
    if (event.x >768 && event.x <= 905 && event.y >= 309 && event.y <= 451) {
        theSound[0].play();
        Hue2 = int(random(1, 360));
    }
}

$('#recording_button_i').on('click', function () {
    console.log('Start Rec!');
    if (state === 0 && mic.enabled) {
        // record to our p5.SoundFile
        $('#recording_button_i').text('録音中...');
        recorder.record();
        state++;
    }
    else if (state === 1) {
        // stop recorder and
        // send result to soundFile
        recorder.stop();
        $('#recording_button_i').text('再生');
        state++;
    }
    else if (state === 2) {
        soundFile.play(); // play the result!
        save(soundFile, 'mySound.wav');
        state++;
    } else {
        soundFile.play();
    }
});

$('#mixing_button_i').on('click', function () {
    console.log('Start mixing!');
    if (mixingFile[mixingNumber] === undefined) {
        mixingFile[mixingNumber] = new p5.SoundFile();
    }
    if (state === 0 && mic.enabled) {
        metronome = setInterval(function () {
            theSound[1].play();
            count--;
            setTimeout(function () {
                theSound[1].stop();
                theSound[1].currentTime(0);
            }, 100)
        }, 60 / currentTempo * 1000);
        // record to our p5.SoundFile

        setTimeout(function () {
            recorder.record(mixingFile[mixingNumber]);
        }, 8 * 60 / currentTempo * 1000);
        $('#mixing_button_i').text('録音中...');
        state++;
    }
    else if (state === 1) {
        clearInterval(metronome);
        // stop recorder and
        // send result to soundFile
        recorder.stop();
        $('#mixing_button_i').text('再生');
        state++;
    }
    else if (state === 2) {
        for (let i = 0; i < mixingNumber + 1; i++) {
            mixingFile[i].play();
             // play the result!
        }
        $('#mixing_button_i').text('mixing');
        // save(mixingFile, 'mySound.wav');
        state = 0;
        mixingNumber++;
    }
})


// 計算と描画
function draw() {
// ----- ビジュアライザーで使う情報 -----
    // 配列_周波数スペクトル全体の振幅値（0〜255）
    spectrum = fft.analyze();

    // 配列_波形の値（-1.0〜1.0）
    waveform = fft.waveform();

    // 音の大きさを計算(0.0〜1.0)
    volume = amplitude.getLevel();

    // 経過時間（プログラムがスタートしてからの経過秒）
    time = millis()/1000;

// ----- ビジュアライザー呼び出す -----
    // 現在の座標の設定を保存
    push();

    // 座標の基準を移動
    translate(width / 2, height / 2);


    soundVisualizer5();

    // pushで保存した座標を復元する
    pop();

    rec = soundRecorder();

    noStroke();
    fill(0, 0, 100, 80)
    ellipse(mouseX, mouseY, 25, 25);
}

function soundRecorder() {
    if (state === 0) {
        fill('orange');
        noStroke();
        circle(50, 50, 100);

        fill('white');
        textSize(16);
        textAlign(CENTER, CENTER);

        text('Rec', 50, 50);
    }
    else if (state === 1) {
        fill('red');
        noStroke();
        circle(50, 50, 100);
        fill('white');
        if (count <= 0) {
            text('Recording!', 50, 50);
        } else {
            text(count, 50, 50);
        }
    }
    else if (state === 2) {
        fill('crimson');
        noStroke();
        circle(50, 50, 100);
        fill('white');
        text('Done!', 50, 50);
    }
    else if (state === 3) {
        fill('aqua');
        noStroke();
        circle(50, 50, 100);
        fill('white');
        text('Playing!', 50, 50);
    }
}

function soundVisualizer5(){
// ブレンドモードと背景
blendMode(BLEND);
background('black');
blendMode(SCREEN);

// 図形の色の設定
stroke(Hue2, 50, 50, 50);
// 配列の長さ分、繰り返す
for (i = 0; i < waveform.length; i++){
    // 線の長さと座標
    let size =waveform[i] * spectrum.length * 0.5;
    let x = sin(360 * i / waveform.length) * winSize * 0.3;
    let y = cos(360 * i / waveform.length) * winSize * 0.3;

    // 線を描く
    line(x, y, size, size);
}
}

