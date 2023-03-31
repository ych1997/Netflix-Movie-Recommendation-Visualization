# Netflix-Movie-Recommendation-Visualization
### 1092資訊視覺化期末報告

組員：109753103 賴雅鈴、109753107 黃亦晨、110753108 林瀚軒、110753110 邱顯安


![image](https://github.com/ych1997/Netflix-Movie-Recommendation-Visualization/blob/main/image/圖片8.png)

## 1. 介紹:

使用 Netflix movie dataset 做一個電影推薦系統，資料集中包含使用者在什麼時候觀看哪部電影，以及他們給出的評價（1到5分）

此外，利用另一個Netflix movie 資料集及IMDB 資料集找出其他電影的資訊

Netflix電影資料集：https://www.kaggle.com/shivamb/netflix-shows 

IMDB資料集：https://www.kaggle.com/stefanoleone992/imdb-extensive-dataset 

## 2. 資料處理:

### 推薦電影部分

* Data cleaning、Data slicing、Data mapping

* 在推薦部分用了Collaborative Filtering 及Pearsons' R correlation

### 電影資訊部分

* 利用找出與推薦電影部分的電影名稱相符去得到電影的相關資訊（上映年份、國家、演員、劇情描述等）

* 沒有每部電影都有對應到，因此有些資訊為unknown 

## 3.功能說明

### 搜尋功能
![image](https://github.com/ych1997/Netflix-Movie-Recommendation-Visualization/blob/main/image/圖片1.png)
* 將電影名稱輸入在搜尋框，並按下搜尋，可以找到電影，如果電影名稱不在資料庫中，會跳出通知。
* 如果不知道資料庫有哪些電影，可以透過電影列表按鈕之後資料庫中蒐集了哪些電影。
* 電影資訊可能無法提供有關於搜尋電影的資訊，按下更多資訊按鈕，可以跳轉到google查詢頁面

### 二分圖
![image](https://github.com/ych1997/Netflix-Movie-Recommendation-Visualization/blob/main/image/圖片2.png)
* 左半部分為搜尋電影及其相關十部電影
* 右半部將左半部所有電影的相關前五部電影列出
* 左邊%數代表此電影和此相關五部電影與搜尋電影的相關度
* 右邊的%數則代表該電影與搜尋電影的相關度
* 透過二分圖除了可以知道推薦的前十部電影之外，還可以向外再拓展一層關係，使用者在搜尋時可以有更多的選擇

### 電影推薦表
![image](https://github.com/ych1997/Netflix-Movie-Recommendation-Visualization/blob/main/image/圖片3.png)
* 列表中列出和搜尋電影相關的前十部電影並列出其相關度
* 使用者可以透過此列表了解量化過的相關度，並從中去挑選可能有興趣的電影

### 電影評價分佈長條圖
![image](https://github.com/ych1997/Netflix-Movie-Recommendation-Visualization/blob/main/image/圖片4.png)
* 利用長條圖呈現出觀看的人給予的評價分佈（1到5分）
* 在長條圖底下，我們也計算出電影的平均得分及觀看次數
* 使用者可以透過此圖去了解這部電影所獲得的分數及其分佈

### 電影資訊
![image](https://github.com/ych1997/Netflix-Movie-Recommendation-Visualization/blob/main/image/圖片5.png)
* 電影資訊中包含了搜尋電影的電影名稱、年分、時長、拍攝國家、導演、演員、以及簡短的電影介紹
* 電影資訊的資料庫資料不完全，大約只有推薦系統資料庫的7成
* 若沒有電影資訊，可利用search on Google的按鈕，直接跳轉到google上搜尋電影相關資訊



