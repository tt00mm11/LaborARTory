import $ from "jquery";
import p5 from "p5";
import 'p5/lib/addons/p5.sound';

import {
    soundUrl,
    number,
    color,
} from './index.js';

// ローディングの変数
let isLoading = true;
let assetNumber = 2;
let assetCounter = 0;

// キャンバスサイズ、図形サイズの基準を決める変数
let winSize;

// 背景の色を決める変数（透明度設定なし、あり）
let color1, color2;

let fft, amplitude;

// 図形の色彩を決める変数
let hue1 = 0;
let hue2 = 0;

// サウンドデータを入れる変数
let theSound = [];

// ビジュアライザーの数（追加した場合、数を増やす）
let playModeNum = 7;

// サウンドモードの変数
let soundMode = 0;

// プレイモードの変数
let playMode = 1;

// タップの数を数える変数
let tapCounter = 0;

// soundVisualizerで使うデータの変数
let spectrum, waveform, volume, time;

let mic, recorder, soundFile, soundBlob, metronome, rec, loadSound;
const mixingFile = [];
let state = 0;

let mixingNumber = 0;

let currentTempo = 128;

let parent = document.getElementById('content');
let uploadSound = document.getElementById('import_input_i');

let count = 9;

//モーデル sato 211111

$(window).on('load',function(){
    $('.js_modal').fadeIn(3000);
    return false;
});
$('#start').on('click',function(){
    $('.js_modal').fadeOut();
    return false;
});

function changeSound(p) {
    theSound[0] = p.loadSound($('#import_input_i').prop('files')[0]);
    // サウンドの初期化
    theSound[0].stop();
    theSound[0].setVolume(0.5);
}

// サウンドデータをロードする
    // theSound[0] = loadSound('../audio/claploop4.mp3');

// 初期化
const sketch = (p) => {
    uploadSound.addEventListener('change', () => changeSound(p), false);

    $('#play_import_sound').on('click', function () {
        theSound[0].play();
        hue2 = p.int(p.random(1, 360));
    });

    $('#recording_button_i').on('click', function () {
        console.log('Start Rec!');
        if (state === 0 && mic.enabled) {
            // record to our p5.SoundFile
            count = 0;
            $('#recording_button_i').text('録音中...');
            recorder.record(soundFile);
            state++;
        }
        else if (state === 1) {
            // stop recorder and
            // send result to soundFile
            recorder.stop();
            soundBlob = soundFile.getBlob();
            $('#recording_button_i').text('再生');
            state++;
        }
        else if (state === 2) {
            hue2 = p.int(p.random(1, 360));
            soundFile.play(); // play the result!
            $('#recording_button_i').text('録音');
            state = 0;
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
            hue2 = p.int(p.random(1, 360));
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

    $('#play').on('click', function () {
        // $('#loadSound').append(`<source src="${soundUrl}" type="audio/wav">`);
        // hue1 = color;
        // playMode = number;
        loadSound = p.loadSound(soundUrl);
        setTimeout(function () {
            loadSound.play();
        }, 2000);
    });

    p.setup = () => {
        theSound[1] = p.loadSound('audio/low.mp3');
        // p5.AudioInオブジェクトを作成
        mic = new p5.AudioIn();
        // p5.SoundRecorderオブジェクトを作成
        recorder = new p5.SoundRecorder();
        // ensure audio is enabled
        p.userStartAudio();
        // オーディオ入力処理を開始
        mic.start();
        // マイクをレコーダーに接続
        recorder.setInput(mic);
        // 空のp5.SoundFileオブジェクトを作成。録音した音の再生に使用する
        soundFile = new p5.SoundFile();
        mixingFile[0] = new p5.SoundFile();
        hue1 = p.int(p.random(1, 360));


        // 画面サイズの縦横を比較し、小さい値をキャンバスサイズに設定
        winSize = p.min(500, 500);
        let canvas = p.createCanvas(winSize, winSize);

        canvas.parent(parent);

        // 解像度
        p.pixelDensity(2);

        // 色の計算方法をHSB（色相、彩度、明度、透明度）に設定
        p.colorMode(p.HSB, 360, 100, 100, 100);

        // 角度の計算方法を「度」に設定
        p.angleMode(p.DEGREES);

        // 四角形の基準を真ん中に設定
        p.rectMode(p.CENTER);

        // 背景色の設定 #1C0E57
        color1 = p.color(252, 84, 34);
        color2 = p.color(72, 100, 100,);

        // 周波数を解析
        fft = new p5.FFT(0.9, 512);

        // 音量を測定
        amplitude = new p5.Amplitude();

    };

    p.draw = () => {
        // ----- ビジュアライザーで使う情報 -----
        // 配列_周波数スペクトル全体の振幅値（0〜255）
        spectrum = fft.analyze();

        // 配列_波形の値（-1.0〜1.0）
        waveform = fft.waveform();

        // 音の大きさを計算(0.0〜1.0)
        volume = amplitude.getLevel();

        // 経過時間（プログラムがスタートしてからの経過秒）
        time = p.millis() / 1000;

        // ----- ビジュアライザー呼び出す -----
        // 現在の座標の設定を保存
        p.push();

        // 座標の基準を移動
        p.translate(p.width / 2, p.height / 2);


        // プレイモードを設定して、soundVisualizerを呼び出す// ・・・・・・・・・・・・・・・・・・・・・・・・藤﨑F
        playModeSetting(p);

        //soundVisualizer5(p);

        // pushで保存した座標を復元する
        p.pop();

        rec = soundRecorder(p);

        p.noStroke();
        p.fill(0, 0, 100, 80)
        p.ellipse(p.mouseX, p.mouseY, 25, 25);
    };
    p.keyPressed = () => {
        // プレイモードが1以上のとき
        if (playMode >= 1) {

            // 右矢印キーを押して、ビジュアライザーのみ切り替える（進む）
            if (p.keyCode == p.RIGHT_ARROW) {
                // タップの数を数える
                // playMode++;

                // playModeがビジュアライザーの数より小さい場合は1つ進む
                if (playMode < playModeNum) {
                    playMode++;

                    // プレイモードが最後尾の場合は先頭へ
                } else if (playMode == playModeNum) {
                    playMode = 1;
                }
            }

            // 左矢印キーを押して、ビジュアライザーのみ切り替える（戻る）
            if (p.keyCode == p.LEFT_ARROW) {

                // playModeが1より大きい場合は1つ戻る
                if (playMode > 1) {
                    playMode--;

                    //playModeが1の場合は、最後尾へ
                } else if (playMode == 1) {
                    playMode = playModeNum;
                }
            }

            // 下矢印キーを押して、色彩のみ切り替える
            if (p.keyCode == p.DOWN_ARROW) {
                // 色彩をランダムに決める
                hue1 = p.int(p.random(1, 360));
            }
        }
    }
}

////////////////////////////////////////////////////////////////////////////藤﨑
// 矢印キーで、サウンド、色彩、ビジュアライザーをそれぞれ切り替える

function playModeSetting(p) {
    if (playMode == 1) {
        soundVisualizer5(p);
    }
    else if (playMode == 2) {
        soundVisualizer15(p);
    }
    else if (playMode == 3) {
        soundVisualizer17(p);
    }
    else if (playMode == 4) {
        soundVisualizer7(p);
    }
    else if (playMode == 5) {
        soundVisualizer10(p);
    }
    else if (playMode == 6) {
        soundVisualizer21(p);
    }
    else if (playMode == 7) {
        soundVisualizer16(p);
    }
}

new p5(sketch);

function soundRecorder(p) {
    if (state === 0) {
        p.fill('orange');
        p.noStroke();
        p.circle(50, 50, 100);

        p.fill('white');
        p.textSize(16);
        p.textAlign(p.CENTER, p.CENTER);

        p.text('Rec', 50, 50);
    }
    else if (state === 1) {
        p.fill('red');
        p.noStroke();
        p.circle(50, 50, 100);
        p.fill('white');
        if (count <= 0) {
            p.text('Recording!', 50, 50);
        } else {
            p.text(count, 50, 50);
        }
    }
    else if (state === 2) {
        p.fill('crimson');
        p.noStroke();
        p.circle(50, 50, 100);
        p.fill('white');
        p.text('Done!', 50, 50);
    }
    else if (state === 3) {
        p.fill('aqua');
        p.noStroke();
        p.circle(50, 50, 100);
        p.fill('white');
        p.text('Playing!', 50, 50);
    }
}

function soundVisualizer5(p){
// ブレンドモードと背景
p.blendMode(p.BLEND);
p.background('black');
p.blendMode(p.SCREEN);

// 図形の色の設定
p.stroke(hue1, 50, 50, 50);
// 配列の長さ分、繰り返す
for (let i = 0; i < waveform.length; i++){
    // 線の長さと座標
    let size =waveform[i] * spectrum.length * 0.5;
    let x = p.sin(360 * i / waveform.length) * winSize * 0.3;
    let y = p.cos(360 * i / waveform.length) * winSize * 0.3;

    // 線を描く
    p.line(x, y, size, size);
}
}

function soundVisualizer7(p) {
    // ブレンドモードと背景
    p.blendMode(p.BLEND);
    p.background('black');

    // 図形を配置する、全体の大きさ
    let radius = winSize * 0.5;

    // 図形の色を設定
    p.strokeWeight(2);
    p.stroke(hue1, 50, 100, volume * 100 + 50);

    // 配列の長さ分、繰り返す
    for (let i = 0; i < waveform.length; i++) {
        // 線の長さ
        let length = waveform[i] * spectrum.length * 0.2;

        // 配置する位置を調整
        let position = p.map(i, 0, waveform.length, -radius / 2, radius / 2);

        // 4辺の座標（ベクトルを使って、1つの変数で2つの情報(x,y) を持つ）
        let top = p.createVector(position, - radius / 2);
        let bottom = p.createVector(position, radius / 2);
        let left = p.createVector(- radius / 2, position);
        let right = p.createVector(radius / 2, position);

        // 上下左右、4辺に線を描く
        p.line(top.x, top.y, top.x, top.y + length);
        p.line(bottom.x, bottom.y, bottom.x, bottom.y + length);
        p.line(left.x, left.y, left.x + length, left.y);
        p.line(right.x, right.y, right.x + length, right.y);
    }
}

function soundVisualizer10(p) {
    // ブレンドモードと背景
    p.blendMode(p.BLEND);
    p.background('black');
    p.blendMode(p.SCREEN);

    // 角度と大きさ
    let angle = 0;
    let radius = 0;

    // 配列の長さ分、繰り返す
    for (let i = 0; i < waveform.length; i++) {
        // キャンバスを回転
        p.rotate(time * 0.05);

        // 角度と大きさを増やす
        angle += 15;
        radius += 0.4;

        // 円の大きさと座標
        let size = waveform[i] * volume * 10 + 3;
        let x = p.sin(angle) * radius;
        let y = p.cos(angle) * radius;

        // 図形の色を設定
        p.noStroke();
        p.fill(hue1, x, 100);

        // 円を描く
        p.ellipse(x, y, size);
    }
}


function soundVisualizer15(p) {
    // ブレンドモードと背景
    p.blendMode(p.BLEND);
    p.background('black');

    // 頂点の記録開始
    p.beginShape();

    // 配列の長さ分、繰り返す
    for (let i = 0; i < spectrum.length; i++) {
        // 横幅と縦幅の長さ
        let w_length = winSize * 0.8;
        let h_length = p.map(spectrum[i], 0, 255, 0, -winSize * 0.3);

        // X座標
        let x = p.map(i, 0, spectrum.length, -w_length / 2, w_length / 2);

        // 図形の色を設定
        p.noFill();
        p.strokeWeight(3);
        p.stroke(hue1, 50, 100);

        // 頂点を描く（曲線でつなぐ）
        p.curveVertex(x, h_length);
    }
    // 頂点の記録終了
    p.endShape();
}


function soundVisualizer17(p) {
    // ブレンドモードと背景
    p.blendMode(p.BLEND);
    p.background('black');
    p.blendMode(p.SCREEN);

    // 図形を配置する、全体の大きさ
    let radius = winSize * 0.3;

    // 配列の長さ分、繰り返す
    for (let i = 0; i < spectrum.length; i++) {
        // キャンバスを回転
        p.rotate(i);

        // 図形の大きさと座標
        let size = p.map(spectrum[i], 0, 255, 0, radius * 0.9);
        let x = p.sin(i) * radius;
        let y = p.cos(i) * radius;
        let Saturation = p.map(size, 0, radius * 0.4, 0, 100);

        // 図形の色を設定
        p.noFill();
        p.strokeWeight(2);
        p.stroke(hue1, Saturation, 100, 30);

        // 円を描く
        p.ellipse(x, y, size);
    }
}

function soundVisualizer21(p){
// ブレンドモードと背景
p.blendMode(p.BLEND);
p.background('black');
p.blendMode(p.SCREEN);

// 配列の長さ分、繰り返す
for (let i = 0; i < spectrum.length; i+= 2) {
    // キャンバスを回転
    p.rotate(i);
    p.rotate(time);

    // 図形の大きさ
    let size = p.map(spectrum[i], 0, 255, 0, winSize * 0.6);

    // 図形の色の設定
    p.noFill();
    let Saturation = p.map(size, 0, winSize * 0.6, 10, 100);
    p.strokeWeight(2);
    p.stroke(hue1, Saturation, 100);

    // 弧を描く
    p.arc(0, 0, size, size, i * 0.5, i, p.PIE);
}
}

function soundVisualizer16(p){
// ブレンドモードと背景
p.blendMode(p.BLEND);
p.background('black');

// 頂点の記録開始
p.beginShape();

// 配列の長さ分繰り返す
for (let i = 0; i < waveform.length; i++) {
    // 横幅と縦幅の長さ
    let w_length = winSize * 0.8;
    let h_length = p.map(waveform[i], 0, 1, 0, winSize * 0.2);

    // x座標
    let x = p.map(i, 0, waveform.length, -w_length/2, w_length/2);

    // 図形の色を設定
    p.noFill();
    p.strokeWeight(10);
    p.stroke(hue1, 50, 100);

    // 頂点を描く（曲線でつなぐ）
    p.curveVertex(x, h_length);
}

// 頂点の記録終了
p.endShape();
}

export {
    soundBlob,
    hue1,
    playMode,
}