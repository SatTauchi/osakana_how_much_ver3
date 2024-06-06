# ①課題番号-プロダクト名

課題番号5-おさかなハぅマっチ？1(Firebase Realtime Database版)

## ②課題内容（どんな作品か）

- FirebaseのRealtime Databaseを利用したメモパッドの発展版です。実家（鮮魚店）での使用を想定しています。
- また実際の仕入価格、画像などをRealtime Databaseに保存することができ、別画面で画像ファイルを先頭に整理されて出力されます。

## ③DEMO

デプロイしている場合はURLを記入（任意）

## ④作ったアプリケーション用のIDまたはPasswordがある場合

- なし

## ⑤工夫した点・こだわった点

- 課題4に加えて・・・
- Realtime Databaseへ画像（Base64形式）のデータ格納、ボタンをクリックすることで、画像ファイルを先頭にデータが返される。
- Realtime Databaseのデータ階層を整理。魚の種類→日付→その他情報順に階層構造を作るようにした。


## ⑥難しかった点・次回トライしたいこと(又は機能)
- localstorageに続き、格納したデータを使って動的にグラフを更新することに苦戦し、完成に至らなかった。


## ⑦質問・疑問・感想、シェアしたいこと等なんでも

- [質問]


- [感想]
UIはほとんど変更していませんが、localstorageに格納していたデータをRealtime Databaseに格納することで、よりアプリケーションらしくなってきたと感じています。


- [参考記事]
  - 1. https://qiita.com/JunichiHashimoto/items/842f2cb612cae44764b0
  - 2. https://azukipan.com/posts/firebase-storage-post-image/
  
