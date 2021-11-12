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
} from './import.js'

import {
    soundBlob,
} from './sound_visualizer.js'

$('#save').on('click', function () {
    const soundName = $('#sound_name').val();
    // const folder = collection(db, 'sounds');
    // console.log(folder.data());
    const storageRef = ref(storage, soundName);
    const data = {
        soundName: soundName,
        time: serverTimestamp(),
        };
    addDoc(collection(db, 'sounds'), data);
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
        <p>Unknown Name at ${convertFromFirestoreTimestampToDatetime(data.data.time.seconds)}</p>
        </li>
    `);
    });

    $('ul').html(tagArray);
});