import $ from "jquery";

import 'babel-polyfill'

import {
    convertFromFirestoreTimestampToDatetime,
    getFirestore,
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    deleteDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
    db,
    storage,
    ref,
    uploadBytes,
    getDownloadURL,
} from './import.js'

import {
    soundBlob,
} from './sound_visualizer.js'

let soundUrl;

$('#save').on('click', function () {
    const soundName = $('#sound_name').val();
    const folder = collection(db, 'sounds');
    const fileName = doc(folder).id;
    const storageRef = ref(storage, fileName);
    const data = {
        fileName: fileName,
        soundName: soundName,
        time: serverTimestamp(),
    };
    setDoc(doc(db, 'sounds', fileName), data);
    uploadBytes(storageRef, soundBlob).then((snapshot) => {
        alert('アップロード完了！');
    });
});

const q = query(collection(db, 'sounds'), orderBy('time', 'desc'));

onSnapshot(q, (querySnapshot) => {
    const dataArray = [];
    querySnapshot.docs.forEach(function (doc) {
    const data = {
        id: doc.id,
        data: doc.data(),
    };
    dataArray.push(data);
    });

    const tagArray = [];
    dataArray.forEach(function (data) {
    tagArray.push(`
        <li id="${data.id}">
        <p>Unknown recorded ${data.data.soundName} at ${convertFromFirestoreTimestampToDatetime(data.data.time.seconds)}</p>
        </li>
    `);
    });

    $('ul').html(tagArray);
});

$('body').on('click', 'li', async function () {
    console.log(this.id);
    soundUrl = await getDownloadURL(ref(storage, this.id)).then((url) => {
        console.log(url);
        return url;
    });
});

export {
    soundUrl,
}