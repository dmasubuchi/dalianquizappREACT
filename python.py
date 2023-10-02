import json
import requests
import os

def download_images(keyword):
    try:
        # Bing Image Search APIのURLとサブスクリプションキー
        search_url = "https://api.bing.microsoft.com/v7.0/images/search"
        subscription_key = "3ac07ef2ab5143c3bd67b5ca58fb925a"

        # 検索パラメータ
        headers = {"Ocp-Apim-Subscription-Key": subscription_key}
        params = {"q": keyword, "count": 1}

        # Bing Image Search APIを呼び出す
        response = requests.get(search_url, headers=headers, params=params)
        response.raise_for_status()
        search_results = response.json()
        image_url = search_results['value'][0]['contentUrl']

        # 画像をダウンロードする
        image_response = requests.get(image_url)
        image_response.raise_for_status()
        
        # 画像をファイルに保存する
        with open(f"{keyword}.jpg", 'wb') as image_file:
            image_file.write(image_response.content)
        
        print(f"Downloaded image for word '{keyword}'")
    except Exception as e:
        print(f"Error downloading image for word '{keyword}': {e}")

# JSONファイルから英単語のリストを読み込む
file_path = os.path.join('quiz-app', 'public', 'wordlist.json')
with open(file_path, "r", encoding='utf-8') as file:  # ここでencoding='utf-8'を追加
    data = json.load(file)
    english_words = [word['english'] for word in data]

# 各英単語に対して画像をダウンロードする
for word in english_words:
    download_images(word)
