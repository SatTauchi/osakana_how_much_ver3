// Firebaseの設定と初期化
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

// Firebaseプロジェクトの設定情報
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Firebaseアプリの初期化
const app = initializeApp(firebaseConfig);

// データベースの参照を取得
const db = getDatabase(app);
const dbRef = ref(db, "fish_price");
const database = getDatabase(app);

// 1.Saveクリックイベント
function saveData() {
  const dateValue = $("#date").val();
  const fishValue = $("#fish").val();
  const placeValue = $("#place").val();
  const priceValue = $("#price").val();
  const remarksValue = $("#remarks").val();
  const fileInput = document.getElementById("imgFile");

  if (fileInput.files.length === 0) {
      alert("画像ファイルを選択してください。");
      return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = (event) => {
      const fileData = event.target.result;

      // 日付の参照を設定
      const dateRef = ref(db, `fish_price/${fishValue}/${dateValue}`);

      // 保存するデータオブジェクト
      const data = {
        date: dateValue,
        fish: fishValue,
        place: placeValue,
        price: priceValue,
        remarks: remarksValue,
        fileInput: fileData // 画像データはDataURLとして保存
      };

      set(dateRef, data)
      .then(() => {
          console.log('Data saved successfully!');
          clearForm();
      })
      .catch(error => {
          console.error('Error saving data:', error);
      });
  };

  reader.readAsDataURL(file);
}


// Saveクリック後に入力内容をクリアする
function clearForm() {
    $("#date").val("");
    $("#fish").val("");
    $("#place").val("");
    $("#price").val("");
    $("#remarks").val("");
    $("#imgFile").val("");
    $(".preview").css("background-image", "none"); // プレビュー画像をクリア
    window.myLine.destroy();// グラフエリアをクリア
}

$("#save").on("click", saveData);

export { saveData, clearForm };


// ファイル選択欄の変更イベントに関数を結び付けて、プレビュー表示を行う
$('#imgFile').change(
  function () {
      if (!this.files.length) {
          return;
      }

      var file = $(this).prop('files')[0];
      var fr = new FileReader();
      $('.preview').css('background-image', 'none');
      fr.onload = function() {
          $('.preview').css('background-image', 'url(' + fr.result + ')');
      }
      fr.readAsDataURL(file);
  }
);

//2.クリアをクリックした際に入力内容をリセットする
$("#empty").on("click", function () {
  $("#date").val("");
  $("#fish").val(""); 
  $("#place").val("");
  $("#price").val(""); 
  $("#remarks").val(""); 
  $("#imgFile").val("");
  $(".preview").css("background-image", "none"); 
  $("#list").empty();
  window.myLine.destroy();// グラフエリアをクリア 
});

//3.プライスチェック クリックイベント
$("#check").on("click", function () {
  // 選択された魚
  var selectedFish = $("#fish").val();
  // 選択された魚のデータセットを取得
  var fishDataset = fishData[selectedFish];
  if (!fishDataset) {
      alert("魚を選択してください。");
      return;
  }
  
  // 入力された価格
  var priceValue = $("#price").val();
  if (!priceValue) {
      alert("価格を入力してください。");
      return;
  }
  
  // 選択された魚のデータセットと価格を比較して、結果を表示
  var message = "";
  fishDataset.forEach(function(dataset) {
      if (priceValue < dataset.data[dataset.data.length - 1]) {
          message += dataset.label + "と比べて買い！\n";
      } else {
          message += dataset.label + "と比べてうーん…\n";
      }
  });

  
  // 結果をアラートで表示
  alert(message);
});

//4.データベース表示 クリックイベント
  
// データベースからデータを取得してHTMLに表示する関数
function fetchData() {
  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        displayData(data);
    } else {
        console.log("No data available");
    }
}, (error) => {
    console.error("Error fetching data:", error);
});
}

// 取得したデータをHTMLに表示する関数

function displayData(data) {
  const list = $("#list");
  list.empty(); // 既存のリストをクリア

  // データが `fish` キー直下にあると仮定し、その内部のデータをループ処理
  for (const dateKey in data) {
    if (data.hasOwnProperty(dateKey)) {
      const dayData = data[dateKey];  // 日付キーでデータを取得
      for (const key in dayData) {
        const item = dayData[key];
        if (!item) {
          console.error('Missing data for key:', key);
          continue;  // データが不完全な場合はスキップ
        }
        const html = `
            <div class="grid-item">
                <img src="${item.fileInput}" alt="画像">
                <p>日付: ${item.date}<br>おさかな: ${item.fish}<br>産地: ${item.place}<br>金額: ${item.price} 円/kg<br>備考: ${item.remarks}</p>
            </div>
        `;
        list.append(html);
      }
    }
  }
}

// データを見るボタンクリック時にデータをフェッチ
$("#database").on("click", fetchData);

// 5.削除ボタンクリック時にfirebase databaseを削除する
document.getElementById('clear').addEventListener('click', function() {
  const dbRef = ref(database, 'fish_price');
  remove(dbRef)
      .then(() => {
          console.log('Data removed successfully!');
          alert('データが正常に削除されました。');
      })
      .catch((error) => {
          console.error('Failed to remove data', error);
          alert('データ削除に失敗しました。');
      });
});

// 魚ごとのデータセット
const fishData = {
  ハマチ: [
    {
        label: "2023年のハマチ価格",
        fillColor: "rgba(92,220,92,0.2)",
        strokeColor: "rgba(92,220,92,1)",
        pointColor: "rgba(92,220,92,1)",
        pointStrokeColor: "white",
        pointHighlightFill: "yellow",
        pointHighlightStroke: "green",
        data: [1900, 1890, 1870, 1810, 1690, 1590, 1560, 1540, 1540, 1530, 1430, 1420]
    },
    {
        label: "2024年のハマチ価格",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "white",
        pointHighlightFill: "yellow",
        pointHighlightStroke: "blue",
        data: [1540, 1620, 1680, 1670, 1720,]
    }
],
  マグロ: [
      {
          label: "2023年のマグロ価格",
          fillColor: "rgba(92,220,92,0.2)",
          strokeColor: "rgba(92,220,92,1)",
          pointColor: "rgba(92,220,92,1)",
          pointStrokeColor: "white",
          pointHighlightFill: "yellow",
          pointHighlightStroke: "green",
          data: [4720, 4370, 4370, 4110, 3780, 3020, 3490, 4300, 4600, 4350, 4540, 4340]
      },
      {
          label: "2024年のマグロ価格",
          fillColor: "rgba(151,187,205,0.2)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "white",
          pointHighlightFill: "yellow",
          pointHighlightStroke: "blue",
          data: [3620, 3120, 3210, 3550, 3070,]
      }
  ],
  サバ: [
      {
          label: "2023年のサバ価格",
          fillColor: "rgba(92,220,92,0.2)",
          strokeColor: "rgba(92,220,92,1)",
          pointColor: "rgba(92,220,92,1)",
          pointStrokeColor: "white",
          pointHighlightFill: "yellow",
          pointHighlightStroke: "green",
          data: [630, 560, 580, 560, 530, 450, 500, 530, 570, 590, 570, 650]
      },
      {
          label: "2024年のサバ価格",
          fillColor: "rgba(151,187,205,0.2)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "white",
          pointHighlightFill: "yellow",
          pointHighlightStroke: "blue",
          data: [430, 420, 360, 410, 440]
      },

  ],
  アジ: [
      {
          label: "2023年のアジ価格",
          fillColor: "rgba(92,220,92,0.2)",
          strokeColor: "rgba(92,220,92,1)",
          pointColor: "rgba(92,220,92,1)",
          pointStrokeColor: "white",
          pointHighlightFill: "yellow",
          pointHighlightStroke: "green",
          data: [530, 510, 540, 540, 590, 670, 650, 750, 780, 580, 590, 650]
      },
      {
        label: "2024年のアジ価格",
          fillColor: "rgba(151,187,205,0.2)",
          strokeColor: "rgba(151,187,205,1)",
          pointColor: "rgba(151,187,205,1)",
          pointStrokeColor: "white",
          pointHighlightFill: "yellow",
          pointHighlightStroke: "blue",
        data: [750, 800, 710, 660, 690]
    },

  ]
};

// グラフ更新関数
function updateGraph(fish) {
  var ctx = document.getElementById("graph").getContext("2d");
  var newChartData = {
      labels: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
      datasets: []
  };

  if (fishData[fish]) {
      newChartData.datasets = fishData[fish];
  }

  if (window.myLine) {
      window.myLine.destroy(); // グラフの初期化
  }
  window.myLine = new Chart(ctx).Line(newChartData); // 新しいデータでグラフを描画
}

// 魚の選択が変更されたときのイベントハンドラ
$("#fish").change(function () {
  var selectedFish = $(this).val();
  updateGraph(selectedFish); // グラフを更新
});

// 初期グラフ表示
updateGraph($("#fish").val());

// // グローバル変数としてグラフインスタンスを宣言
// let myChart = null;

// // グラフを描画または更新する関数
// function drawChart(data) {
//   const ctx = document.getElementById('myChart').getContext('2d');
//   if (myChart) {
//     myChart.destroy();
//   }
//   try {
//     myChart = new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: data.dates,
//         datasets: [{
//           label: '価格',
//           data: data.prices,
//           borderColor: 'rgb(75, 192, 192)',
//           backgroundColor: 'rgba(75, 192, 192, 0.2)',
//         }]
//       },
//       options: {
//         scales: {
//           y: {
//             beginAtZero: true
//           }
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Error initializing chart:', error);
//   }
// }


// // Firebaseからデータを取得してグラフを更新
// function updateGraph(fishType) {
//   const prices = [];
//   const dates = [];
//   const dbRef = ref(db, `fish_price/${fishType}`);

//   onValue(dbRef, (snapshot) => {
//     snapshot.forEach((childSnapshot) => {
//         const date = childSnapshot.key;
//         const price = childSnapshot.val().price;
//         dates.push(date);
//         prices.push(price);
//     });
//     console.log(dates, prices); // データの確認
//     drawChart({ dates, prices });
// }, (error) => {
//     console.error('Error fetching data:', error);
// });
// }

// // 特定の魚種でグラフを更新
//   updateGraph($("#fish").val()); // DOMが完全にロードされた後に実行
