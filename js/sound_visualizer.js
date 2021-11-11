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

let mic, recorder, soundFile, rec;
let state = 0;

// データをロード
function loadAsset() {
// テキストフォントを設定
textFont('Megrim');

// サウンドデータをロードする
    theSound[0] = loadSound('../audio/claploop4.mp3');
}

// 初期化
function setup() {

    Hue1 = int(random(1, 360));

// create an audio in
mic = new p5.AudioIn();

// prompts user to enable their browser mic
mic.start();

// create a sound recorder
recorder = new p5.SoundRecorder();

// connect the mic to the recorder
recorder.setInput(mic);

// this sound file will be used to
// playback & save the recording
soundFile = new p5.SoundFile();


// 画面サイズの縦横を比較し、小さい値をキャンバスサイズに設定
winSize = min(windowWidth, windowHeight);
cnv = createCanvas(winSize, winSize);

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

// サウンドの初期化
theSound[0].stop();

// 周波数を解析
fft = new p5.FFT(0.9, 512);

// 音量を測定
    amplitude = new p5.Amplitude();

}

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

function windowResized() {
// 縦と横を比較して、画面サイズの小さい方をキャンバスのサイズする
winSize = min(windowWidth, windowHeight);
resizeCanvas(winSize, winSize);
}

function soundRecorder() {


    fill('red');
    noStroke();
    circle(100, 100, 150)

    fill('white');
    textSize(20);
    textAlign(CENTER, CENTER);

    text('Rec Sound', 100, 100);
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

// タップ（クリック）して、プレイモードを決める
function touchStarted(event) {
    console.log(event);
    if (event.x >= 350 && event.x <= 700 && event.y >= 500 && event.y <= 850) {
        theSound[0].play();
        Hue2 = int(random(1, 360));
    } else if (event.x >= 40 && event.x <= 190 && event.y >= 180 && event.y <= 330) {
            console.log('Start Rec!');
        // ensure audio is enabled
        userStartAudio();

        // make sure user enabled the mic
        if (state === 0 && mic.enabled) {

            // record to our p5.SoundFile
            recorder.record(soundFile);

            background('pink');
            text('Recording!', width/2, height/2);
            state++;
        }
        else if (state === 1) {
            background('crimson');

            // stop recorder and
            // send result to soundFile
            recorder.stop();

            text('Done! Tap to play and download', width/2, height/2, width - 20);
            state++;
        }

        else if (state === 2) {
            soundFile.play(); // play the result!
            save(soundFile, 'mySound.wav');
            state++;
        }
    }
}



function mouseClicked() {

}


rec.mouseClicked();