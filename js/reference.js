// ローディングの変数
let isLoading = true;
let assetNumber = 2;
let assetCounter = 0;

// キャンバスサイズ、図形サイズの基準を決める変数
let winSize;

// 背景の色を決める変数（透明度設定なし、あり）
let color1, color2;

// 図形の色彩を決める変数
let Hue = 0;

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

// データをロード
function loadAsset() {
// テキストフォントを設定
textFont('Megrim');

// サウンドデータをロードする
theSound[0] = loadSound('sound00.mp3', assetLoaded);
theSound[1] = loadSound('sound01.mp3', assetLoaded);

// 音がロードされたらカウンターを増やす
function assetLoaded() {
    assetCounter++;
    if(assetCounter == assetNumber) {
    isLoading = false;
    }
}
}

// 初期化
function setup() {
// 画面サイズの縦横を比較し、小さい値をキャンバスサイズに設定
winSize = min(windowWidth, windowHeight);
createCanvas(winSize, winSize);

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
color2 = color(252, 84, 34, 20);

// サウンドの初期化
theSound[0].stop();

// 周波数を解析
fft = new p5.FFT(0.9, 512);

// 音量を測定
amplitude = new p5.Amplitude();
}

// 計算と描画
function draw() {
// ローディングアニメーション
if (isLoading == true) {
    background(color1);
    textSize(winSize * 0.05);
    textAlign(CENTER, CENTER);
    stroke(54, 100, 64);
    fill(54, 100, 64);
    text('Loading...', width / 2, height / 2);
}

// ローディングが終わったら、イントロダクションを読み込む
else if (isLoading == false && playMode == 0) {
    // スタート画面を呼び出す
    startWindow();
}

// プレイモードが1以上のとき
if(playMode >= 1){

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
    translate(width/2, height/2);

    // プレイモードを設定して、soundVisualizerを呼び出す
    playModeSetting();

    // pushで保存した座標を復元する
    pop();

// ----- ビジュアライザーで表示するテキスト -----
    // テキストの設定（ビジュアライザー表示時）
    noStroke();
    fill(Hue, 20, 100);
    textSize(winSize * 0.05);

    textAlign(LEFT, CENTER);
    text('Sound Visualizer ' + playMode, 15, 20);

    //textAlign(RIGHT, CENTER);
    //text('@nasana_x', width - 15, height - 20);

    // 「tap!」のテキストのみ、発光っぽい表現をつける
    push();
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = color(Hue, 100, 100);
    // 線の色
    stroke(Hue, 80, 50, 100);
    // テキストサイズ
    textSize(winSize * 0.05);
    // テキストの配置（水平方向、垂直方向）
    textAlign(CENTER, CENTER);
    // 表示するテキストと位置
    text(tapCounter + ' tap!', width / 2, height / 2);
    pop();
}
}

// スタート画面
function startWindow(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);
blendMode(SCREEN);

// 「Tap to play!!」のテキストのみ、発光っぽい表現をつける
push();
    stroke(54, 100, 50, 100);

drawingContext.shadowBlur = 30;
drawingContext.shadowColor = color(54, 100, 100);
    // テキストサイズ、配置、表示する位置
    textSize(winSize * 0.12);
    textAlign(CENTER, CENTER);
    text('Tap to play !!', width/2, height/2);
pop();

// 上部のテキスト設定
textSize(winSize * 0.05);
textAlign(CENTER, TOP);
text('try it!',width / 2, height / 8);
text('Tap! sound visualizer',  width / 2, height / 4);

// 下部のテキスト設定
textSize(winSize * 0.03);
stroke(54, 100, 64);
fill(54, 100, 64);
textAlign(RIGHT, CENTER);
text('@nasana_x', width - 20, height - 20);

// 中央下のテキスト設定
textSize(winSize * 0.03);
textAlign(LEFT, CENTER);
text('This is interactive art with p5.js & p5.sound.', 20, height - 85);
textSize(winSize * 0.02);
text('[ tap ] or [ click ] change color & graphic', 20, height - 60);
text('[↑] change sound　　[↓] change color　　[←][→] change graphic', 20, height - 40);
text('[ esc ] save png', 20, height - 20);

}

// タップ（クリック）して、プレイモードを決める
function touchStarted() {
// タップの数を数える
tapCounter++;

// サウンドをループ再生
if(playMode == 0){
    theSound[0].loop();
}

// プレイモードを変更する
if(playMode < playModeNum){
    playMode++;

// 最後尾の場合は、先頭に戻す
} else {
    playMode = 1;
}

// 色彩をランダムに決める
Hue = int(random(1, 360));
}

// 矢印キーで、サウンド、色彩、ビジュアライザーをそれぞれ切り替える
function keyPressed(){
// プレイモードが1以上のとき
if(playMode >= 1){
    // 上矢印キーを押して、サウンドを切り替える
    if(keyCode ==  UP_ARROW){
    // タップの数を数える
    tapCounter++;

    // soundModeを順番に切り替える
    if(soundMode < theSound.length - 1){
        // 現在のサウンドを止める
        theSound[soundMode].stop();

        // サウンドモードの数を1つ増やす
        soundMode++;

        // 切り替えたサウンドをループ再生する
        theSound[soundMode].loop();

        // soundModeが最後尾の場合は、先頭に戻す
    } else {
        // 現在のサウンドを止める
        theSound[soundMode].stop();

        // サウンドモードを先頭に戻す
        soundMode = 0;

        // 切り替えたサウンドをループ再生する
        theSound[soundMode].loop();
    }
    }

    // 右矢印キーを押して、ビジュアライザーのみ切り替える（進む）
    if(keyCode == RIGHT_ARROW){
    // タップの数を数える
    tapCounter++;

    // playModeがビジュアライザーの数より小さい場合は1つ進む
    if(playMode < playModeNum){
        playMode++;

        // プレイモードが最後尾の場合は先頭へ
    }else if(playMode == playModeNum){
        playMode = 1;
    }
    }

    // 左矢印キーを押して、ビジュアライザーのみ切り替える（戻る）
    if(keyCode == LEFT_ARROW){
    // タップの数を数える
    tapCounter++;

    // playModeが1より大きい場合は1つ戻る
    if(playMode > 1){
        playMode--;

        //playModeが1の場合は、最後尾へ
    }else if(playMode == 1) {
        playMode = playModeNum;
    }
    }

    // 下矢印キーを押して、色彩のみ切り替える
    if(keyCode == DOWN_ARROW){
    // タップの数を数える
    tapCounter++;

    // 色彩をランダムに決める
    Hue = int(random(1, 360));
    }
}

if (keyCode === ESCAPE) {
    save('soundVisualizer.png');
}
}

// ウィンドウリサイズ時にキャンバスをウィンドウに合わせる
function windowResized() {
// 縦と横を比較して、画面サイズの小さい方をキャンバスのサイズする
winSize = min(windowWidth, windowHeight);
resizeCanvas(winSize, winSize);
}

// プレイモードを設定して、soundVisualizerを呼び出す
function playModeSetting(){
if(playMode == 1){
    soundVisualizer1();
}
else if(playMode == 2){
    soundVisualizer2();
}
else if(playMode == 3){
    soundVisualizer3();
}
else if(playMode == 4){
    soundVisualizer4();
}
else if(playMode == 5){
    soundVisualizer5();
}
else if(playMode == 6){
    soundVisualizer6();
}
else if(playMode == 7){
    soundVisualizer7();
}
else if(playMode == 8){
    soundVisualizer8();
}
else if(playMode == 9){
    soundVisualizer9();
}
else if(playMode == 10){
    soundVisualizer10();
}
else if(playMode == 11){
    soundVisualizer11();
}
else if(playMode == 12){
    soundVisualizer12();
}
else if(playMode == 13){
    soundVisualizer13();
}
else if(playMode == 14){
    soundVisualizer14();
}
else if(playMode == 15){
    soundVisualizer15();
}
else if(playMode == 16){
    soundVisualizer16();
}
else if(playMode == 17){
    soundVisualizer17();
}
else if(playMode == 18){
    soundVisualizer18();
}
else if(playMode == 19){
    soundVisualizer19();
}
else if(playMode == 20){
    soundVisualizer20();
}
else if(playMode == 21){
    soundVisualizer21();
}
else if(playMode == 22){
    soundVisualizer22();
}
else if(playMode == 23){
    soundVisualizer23();
}
else if(playMode == 24){
    soundVisualizer24();
}
else if(playMode == 25){
    soundVisualizer25();
}
}

// ビジュアライザー
function soundVisualizer1(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);
blendMode(SCREEN);

// キャンバスを回転
rotate(45);

// 図形の色の設定
noStroke();
fill(Hue, 50, 100, 20);

// 配列の長さ分、繰り返す
for (let i = 0; i < spectrum.length; i+= 10) {
    // 図形の大きさ
    let size = map(spectrum[i], 0, 255, 0, winSize * 0.4);

    // 四角形を描く
    rect(0, 0, size, size);
}
}

function soundVisualizer2(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);
blendMode(SCREEN);

// キャンバスを回転
rotate(180);

// 図形の色の設定
noStroke();
fill(Hue, 80, 100, 30);

// 配列の長さ分、繰り返す
for (let i = 0; i < spectrum.length; i+= 10) {
    // 図形のの大きさ
    let size = map(spectrum[i], 0, 255, 0, winSize * 0.4);

    // 正多角形の頂点数
    let polygon = 3;

    // 図形を描き始める
    beginShape();

    // 正円の円周上を、正多角形の頂点数で等分する
    for (let j = 0; j < polygon; j++) {
    // 頂点の座標
    vertex(sin(360 * j / polygon) * size,
            cos(360 * j / polygon) * size);
    }

    // 頂点を線で繋いで図形を描き終える
    endShape(CLOSE);
}
}

function soundVisualizer3(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);
blendMode(SCREEN);

// 図形の色の設定
noStroke();
fill(Hue, 80, 100, 50);

// 配列の長さ分繰り返す
for (let i = 0; i < spectrum.length; i+= 20) {
    // 図形の大きさ
    let size = map(spectrum[i], 0, 255, 0, winSize * 0.3);

    // 正多角形の頂点数
    let polygon = 12;

    // 図形を描き始める
    beginShape();

    // 正円の円周上を、正多角形の頂点数で等分する
    for (let j = 0; j < polygon; j++) {
    // キャンバスを回転
    rotate(time * 0.5);

    // 頂点の座標
    vertex(sin(360*j/polygon) * size,
            cos(360*j/polygon) * size);
    }

    //頂点を線で繋いで図形を描き終える
    endShape(CLOSE);
}
}

function soundVisualizer4(){
// ブレンドモードと背景
blendMode(BLEND);
background(color2);
blendMode(SCREEN);

// 配列の長さ分繰り返す
for (let i = 0; i < spectrum.length; i+= 20) {
    // 図形の大きさ
    let size = map(spectrum[i], 0, 255, 0, winSize * 0.3);

    // 正多角形の頂点数
    let polygon = 6;

    // 図形の色を設定
    let Saturation = map(size, 0, winSize * 0.3 , 0, 100);
    noStroke();
    fill(Hue, Saturation, 100, 50);

    // 図形を描き始める
    beginShape();

    // 正円の円周上を、正多角形の頂点数で等分する
    for (let j = 0; j < polygon; j++) {
    // キャンバスを回転
    rotate(time * 0.5);

    // 頂点の座標
    vertex(sin(360 * j / polygon) * size,
            cos(360 * j / polygon) * size);
    vertex(sin(360 * j / polygon) * -size,
            cos(360 * j / polygon) * -size);
    }

    //頂点を線で繋いで図形を描き終える
    endShape(CLOSE);
}
}

function soundVisualizer5(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);
blendMode(SCREEN);

// 図形の色の設定
stroke(Hue, 50, 50, 50);

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

function soundVisualizer6(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);

// 図形を配置する、全体の大きさ
let radius = winSize * 0.3;

// 図形の色を設定
stroke(Hue, 60, 100, volume * 100 + 50);
strokeWeight(2);
// 配列の長さ分、繰り返す
for (i = 0; i < waveform.length; i++){
    // 図形の大きさと座標
    let size = waveform[i]  * (radius * 0.1) + radius;
    let x = sin(360 * i / waveform.length);
    let y = cos(360 * i / waveform.length);

    // 線を描く
    line(x * radius, y * radius, x * size , y *  size);

    // 0.5倍に縮小して線を描く
    push();
    scale(0.5);
    line(x * radius, y * radius, x * size , y *  size);
    pop();
}
}

function soundVisualizer7(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);

// 図形を配置する、全体の大きさ
let radius = winSize * 0.5;

// 図形の色を設定
strokeWeight(2);
stroke(Hue, 50, 100, volume * 100 + 50);

// 配列の長さ分、繰り返す
for (i = 0; i < waveform.length; i++){
    // 線の長さ
    let length = waveform[i] * spectrum.length * 0.02;

    // 配置する位置を調整
    let position = map(i, 0, waveform.length, -radius/2, radius/2);

    // 4辺の座標（ベクトルを使って、1つの変数で2つの情報(x,y) を持つ）
    let top = createVector(position, - radius / 2);
    let bottom = createVector(position, radius / 2);
    let left = createVector(- radius / 2, position);
    let right = createVector(radius / 2, position);

    // 上下左右、4辺に線を描く
    line(top.x, top.y, top.x, top.y + length);
    line(bottom.x, bottom.y, bottom.x, bottom.y + length);
    line(left.x, left.y, left.x + length, left.y);
    line(right.x, right.y, right.x + length, right.y);
}
}

function soundVisualizer8(){
// ブレンドモードと背景
blendMode(BLEND);
background(color2);

// 図形を配置する、全体の大きさ
let radius = winSize * 0.3;

// 配列の長さ分、繰り返す
for (i = 0; i < spectrum.length; i++){
    // キャンバスを回転
    rotate(i);

    // 図形の大きさと座標
    let size = map(spectrum[i], 0, 255, 0, radius * 0.5);
    let x = sin(i) * radius;
    let y = cos(i) * radius;

    // 図形の色を設定
    noStroke();
    Saturation = map(size, 0, radius * 0.5, 0, 100);
    fill(Hue, Saturation, 100, volume * 100);

    // 円を描く
    ellipse(x, y, size);
}
}

function soundVisualizer9(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);
blendMode(SCREEN);

// キャンバスを回転
rotate(45);

// 図形を配置する、全体の大きさ
let radius = winSize * 0.3;

// 配列の長さ分繰り返す
for (i = 0; i < spectrum.length; i+= 2){
    // 四角形の大きさと座標
    let size = map(spectrum[i], 0, 255, 0, radius * 0.5);
    let x = sin(i) * radius;
    let y = cos(i) * radius;

    // 図形の色を設定
    noStroke();
    Saturation = map(size, 0, radius * 0.5, 0, 100);
    fill(Hue, Saturation, 100, 50);

    // 四角形を書く（5番目、6番目の引数で角に丸みをつける）
    rect(x, y, size, size, 3, 3);
}
}

function soundVisualizer10(){
// ブレンドモードと背景
blendMode(BLEND);
background(color2);
blendMode(SCREEN);

// 角度と大きさ
let angle = 0;
let radius = 0;

// 配列の長さ分、繰り返す
for (i = 0; i < waveform.length; i++){
    // キャンバスを回転
    rotate(time * 0.05);

    // 角度と大きさを増やす
    angle += 15;
    radius += 0.4;

    // 円の大きさと座標
    let size = waveform[i] * volume * 10 + 3 ;
    let x = sin(angle) * radius;
    let y = cos(angle) * radius;

    // 図形の色を設定
    noStroke();
    fill(Hue, x, 100);

    // 円を描く
    ellipse(x, y, size);
}
}

function soundVisualizer11(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);

// 座標の基準を移動させる
translate(-width / 2, height / 4);

// 左右の余白
let padding = winSize * 0.1;

// 内側の余白
let margin = padding * 0.1;

// 横に並べる図形の数
let cells = 20;

// 配列の長さ分、繰り返す
for (i = 0; i < spectrum.length; i++){
    // 動きの幅
    let length = map(spectrum[i], 0, 255, winSize * 0.1, winSize * 0.4);

    // 図形が均等に並ぶように調整
    let equally = map(i, 0, spectrum.length, 0, cells);

    // 図形1つあたりの大きさを計算
    let size = (width - padding * 2) / cells;

    // X座標
    let x = padding + int(equally + 0.5) * size;

    // Y座標
    for(y = 0; y < length; y++){
    // Y座標を等間隔に並べる
    y += size;

    // 図形の色の設定
    noStroke();
    fill(Hue, 100 / y * 10, 100);

    // 四角形を書く
    rect(x, - y , size - margin, size - margin);
    }
}
}

function soundVisualizer12(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);

// 座標の基準を移動させる
translate(-width / 2, height / 4);

// 左右の余白
let padding = winSize * 0.1;

// 内側の余白
let margin = padding * 0.1;

// 横に並べる図形の数
let cells = 20;

// 配列の長さ分、繰り返す
for (i = 0; i < spectrum.length; i++){
    // 動きの幅
    let length = map(spectrum[i], 0, 255, winSize * 0.1, winSize * 0.4);

    // 図形が均等に並ぶように調整
    let equally = map(i, 0, spectrum.length, 0, cells);

    // 図形1つあたりの大きさを計算
    let size = (width - padding * 2) / cells;

    // X座標
    let x = padding + int(equally + 0.5) * size;

    // Y座標
    for(y = 0; y < length; y++){
    // Y座標を等間隔に並べる
    y += size;

    // 図形の色の設定
    noStroke();
    fill(Hue, 100 / y * 10, 100);

    // 円を書く
    ellipse(x, - y , size - margin);
    }
}
}

function soundVisualizer13(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);

// 座標の基準を移動させる
translate(-width/2, 0);

// 図形の色を設定
noStroke();
fill(Hue, volume * 100 + 30, 100);

// 左右の余白
let padding = winSize * 0.2;

// 内側の余白
let margin = padding * 0.15;

// 横に並べる図形の数
let cells = 10;

// 配列の長さ分、繰り返す
for (i = 0; i < spectrum.length; i++){
    // 四角形の長さ
    let h_length = map(spectrum[i], 0, 255, winSize * 0.15, winSize * 0.5);

    // 図形が均等に並ぶように調整
    let equally = map(i, 0, spectrum.length, 0, cells);

    // 図形1つあたりの大きさを計算
    let size = (width - padding * 2) / cells;

    // X座標
    let x = padding + int(equally + 0.5) * size;

    // 四角形を書く
    rect(x, 0 , size - margin, h_length);
}
}

function soundVisualizer14(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);

// 座標の基準を移動させる
translate(-width/2, 0);

// 図形の色を設定
noStroke();
fill(Hue, volume * 100 + 30, 100);

// 左右の余白
let padding = winSize * 0.2;

// 内側の余白
let margin = padding * 0.1;

// 横に並べる図形の数
let cells = 20;

// 配列の長さ分、繰り返す
for (i = 0; i < spectrum.length; i++){
    // 四角形の長さ
    let h_length = map(spectrum[i], 0, 255, winSize * 0.15, winSize * 0.5);

    // 図形が均等に並ぶように調整
    let equally = map(i, 0, spectrum.length, 0, cells);

    // 図形1つあたりの大きさを計算
    let size = (width - padding * 2) / cells;

    // X座標
    let x = padding + int(equally + 0.5) * size;

    // 四角形を書く（5番目、6番目の引数で角に丸みをつける）
    rect(x, 0 , size - margin, h_length, 10, 10);
}
}

function soundVisualizer15(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);

// 頂点の記録開始
beginShape();

// 配列の長さ分、繰り返す
for (i = 0; i < spectrum.length; i++) {
    // 横幅と縦幅の長さ
    let w_length = winSize * 0.8;
    let h_length = map(spectrum[i], 0, 255, 0, -winSize * 0.3);

    // X座標
    let x = map(i, 0, spectrum.length, -w_length/2, w_length/2);

    // 図形の色を設定
    noFill();
    strokeWeight(3);
    stroke(Hue, 50, 100);

    // 頂点を描く（曲線でつなぐ）
    curveVertex(x, h_length);
}

// 頂点の記録終了
endShape();
}

function soundVisualizer16(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);

// 頂点の記録開始
beginShape();

// 配列の長さ分繰り返す
for (i = 0; i < waveform.length; i++) {
    // 横幅と縦幅の長さ
    let w_length = winSize * 0.8;
    let h_length = map(waveform[i], 0, 1, 0, winSize * 0.2);

    // x座標
    let x = map(i, 0, waveform.length, -w_length/2, w_length/2);

    // 図形の色を設定
    noFill();
    strokeWeight(10);
    stroke(Hue, 50, 100);

    // 頂点を描く（曲線でつなぐ）
    curveVertex(x, h_length);
}

// 頂点の記録終了
endShape();
}

function soundVisualizer17(){
// ブレンドモードと背景
blendMode(BLEND);
background(color2);
blendMode(SCREEN);

// 図形を配置する、全体の大きさ
let radius = winSize * 0.3;

// 配列の長さ分、繰り返す
for (i = 0; i < spectrum.length; i++){
    // キャンバスを回転
    rotate(i);

    // 図形の大きさと座標
    let size = map(spectrum[i], 0, 255, 0, radius * 0.9);
    let x = sin(i) * radius;
    let y = cos(i) * radius;
    let Saturation = map(size, 0, radius * 0.4 , 0, 100);

    // 図形の色を設定
    noFill();
    strokeWeight(2);
    stroke(Hue, Saturation, 100, 30);

    // 円を描く
    ellipse(x, y, size);
}
}

function soundVisualizer18(){
// ブレンドモードと背景
blendMode(BLEND);
background(color2);
blendMode(SCREEN);

// 図形を配置する、全体の大きさ
let radius = winSize * 0.3;

// 配列の長さ分、繰り返す
for (i = 0; i < spectrum.length; i+= 2){
    // キャンバスを回転
    rotate(i);

    // 図形の大きさと座標
    let size = map(spectrum[i], 0, 255, 0, radius * 0.8);
    let x = sin(i) * radius;
    let y = cos(i) * radius;
    let Saturation = map(size, 0, radius * 0.4 , 0, 100);

    // 図形の色を設定
    noFill();
    strokeWeight(2);
    stroke(Hue, Saturation, 100, 30);

    // 四角形を書く（5番目、6番目の引数で角に丸みをつける）
    rect(x, y, size, size , 5, 5);
    rect(x, y, size / 2, size / 2, 5, 5);
}
}

function soundVisualizer19(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);
blendMode(SCREEN);

// 座標の基準を移動させる
translate(-width/2, -height/2);

// 1辺あたりに並べる図形の数
let cells = 3;

// cells 1つ当たりの横幅と幅
let w = (winSize - (cells - 1)) / cells;
let h = (winSize - (cells - 1)) / cells;

// 縦と横に繰り返し、図形を配置する
for (let y = 0 ; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
    // 図形のX座標とY座標
    let cellsX = w * x + w / 2;
    let cellsY = h * y + h / 2;

    // 現在の座標の設定を保存
    push();

    // 座標の基準を移動させる
    translate(cellsX, cellsY);

    // キャンバスを回転
    rotate(45);

    // 図形の色を設定
    noStroke();
    let Saturation = map(y, 0, cells , 30, 100);
    fill(Hue, Saturation , 100, 50);

    // 配列の長さ分、繰り返す
    for (let i = 0; i < waveform.length; i+= 2) {
        // 図形の大きさを計算
        let size = (w + volume) / i + spectrum[i] / i;

        // 四角形を描く
        rect(0, 0, size, size, 3, 3);
    }

    // pushで保存した座標を復元する
    pop();
    }
}
}

function soundVisualizer20(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);

// 配列の長さ分、繰り返す
for (let i = 0; i < spectrum.length; i++) {
    // キャンバスを回転
    rotate(i);

    // 図形の大きさ
    let size = map(spectrum[i], 0, 255, 0, winSize * 0.6);

    // 図形の色の設定
    let Saturation = map(size, 0, winSize * 0.6, 20, 100);
    noStroke();
    fill(Hue, Saturation, 100);

    // 弧を描く
    arc(0, 0, size, size, i * 0.5, i, PIE);
}
}

function soundVisualizer21(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);
blendMode(SCREEN);

// 配列の長さ分、繰り返す
for (let i = 0; i < spectrum.length; i+= 2) {
    // キャンバスを回転
    rotate(i);
    rotate(time);

    // 図形の大きさ
    let size = map(spectrum[i], 0, 255, 0, winSize * 0.6);

    // 図形の色の設定
    noFill();
    let Saturation = map(size, 0, winSize * 0.6, 10, 100);
    strokeWeight(2);
    stroke(Hue, Saturation, 100);

    // 弧を描く
    arc(0, 0, size, size, i * 0.5, i, PIE);
}
}

function soundVisualizer22(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);
blendMode(SCREEN);

// 図形の色を設定
stroke(Hue, 20, 100 , 80);
fill(Hue, volume * 100 + 50, 100, 50);

// 図形を配置する、全体の大きさ
let radius = winSize * 0.3;

// キャンバスを回転
rotate(time * 5);

// 配列の長さ分、繰り返す
for (i = 0; i < spectrum.length; i+= 2){
    // キャンバスを回転
    rotate(i);

    // 図形の大きさと座標
    let size = map(spectrum[i], 0, 255, winSize * 0.2, winSize * 0.6);

    // 弧を描く
    arc(0, 0, size, size, i, i + 10, PIE);
}
}

function soundVisualizer23(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);
blendMode(SCREEN);

push();
// 円の基準を左隅に設定
ellipseMode(CORNER);

// 配列の長さ分、繰り返す
for (i = 0; i < spectrum.length; i+= 2){
    // キャンバスを回転
    rotate(i);

    // 図形の大きさと座標
    let size = map(spectrum[i], 0, 255, 0, winSize * 0.3);
    let Saturation = map(size, 0, winSize * 0.4 , 0, 120);

    // 図形の色を設定
    noFill();
    strokeWeight(2);
    stroke(Hue, Saturation, 80);

    // 円を描く
    ellipse(0, 0, size);
}
pop();
}

function soundVisualizer24(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);
blendMode(SCREEN);

push();
// 四角形の基準を左隅に設定
rectMode(CORNER);

// 配列の長さ分、繰り返す
for (i = 0; i < spectrum.length; i+= 2){
    // キャンバスを回転
    rotate(time);

    // 図形の大きさ
    let size = map(spectrum[i], 0, 255, 0, winSize * 0.3);

    // 図形の色を設定
    let Saturation = map(size, 0, winSize * 0.4 , 0, 120);
    fill(Hue, 80, 100, 10);
    strokeWeight(2);
    stroke(Hue, Saturation, 80);

    // 四角形を書く（5番目、6番目の引数で角に丸みをつける）
    rect(0, 0, size, size, 5, 5);
}
pop();
}

function soundVisualizer25(){
// ブレンドモードと背景
blendMode(BLEND);
background(color1);

// 図形の色を設定
noStroke();
fill(Hue, volume * 100 + 30, 100);

// 図形を配置する、全体の大きさ
let radius = winSize * 0.4;

// キャンバスを回転
rotate(time * 5);

// 配列の長さ分、繰り返す
for (i = 0; i < spectrum.length; i+= 2){
    // キャンバスを回転
    rotate(spectrum.length);

    // 図形の大きさと座標
    let size = map(spectrum[i], 0, 255, winSize * 0.05, winSize * 0.2);
    let x = sin(spectrum.length) * radius;

    // 四角形を書く（5番目、6番目の引数で角に丸みをつける）
    rect(x, 0, size, 8, 10, 10);
}
}