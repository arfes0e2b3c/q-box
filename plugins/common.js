export default{
  modifyUrlInPost(posts, property) {
    posts.map((post) => {
      const url = post[property].match(/((https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
      post[property] = post[property].replace(/((https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig,'<a href="'+ url +'" target="_blank">こちら</a>');
    })
  },
  async deletePost(that, id, endPoint, key) {
    if(window.confirm('削除してよろしいですか？')) {
      await that.$axios.$delete('https://q-box.microcms.io/api/v1/' + endPoint + '/' + id, {
        headers: { 'X-MICROCMS-API-KEY': key}
      }).then(() => {
        if(endPoint === 'q_box_posts') {
          that.getPosts()
        }else if(endPoint === 'q_box_replies') {
          that.setReply()
        }
      })
    }
  },
  async holdPost(that, id, endPoint, key, boolean){
    await that.$axios.$patch(
      'https://q-box.microcms.io/api/v1/' + endPoint +'/' + id, 
      {
        held: !boolean
      }, 
      {
        headers: { 
          "Content-Type": "application/json",
          'X-MICROCMS-API-KEY': key
        }
    }).catch((error) => {
      alert('通信に失敗しました。：' + error)
      console.log(error)
    }).then(() => {
      if(endPoint === 'q_box_posts') {
        that.getPosts()
      }else if(endPoint === 'q_box_replies') {
        that.setReply()
      }
    })
  },
  generateImage(document, posts, mode, alphaId) {
    for(const post of posts) {
      var image = new Image()
      image.src = require('@/assets/img/frame.png')
      image.onload = (function () {
        //画像ロードが完了してからキャンバスの準備をする
        var canvas = document.getElementById(post.id + alphaId)
        var ctx = canvas.getContext('2d')
        //キャンバスのサイズを画像サイズに合わせる
        canvas.width = 600
        canvas.height = 315
        //キャンバスに画像を描画（開始位置0,0）
        var text = post[mode]
        let column = ['']
        let line = 0
        for(const char of text) {
          if(char.match(/\n/) || ctx.measureText(column[line] + char).width * 2 > canvas.width * 0.65) {
            line++
            column[line] = ''
          }
          column[line] += char
        }
        let lineHeight = ctx.measureText('あ').width * 1.5 * 2
        if(line > 3) {
          canvas.height = canvas.height + (line - 3) * lineHeight * 21 / 16
        }
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
        //文字のスタイルを指定
        ctx.font = '20px azuki'
        ctx.fillStyle = '#404040'
        //文字の配置を指定（左上基準にしたければtop/leftだが、文字の中心座標を指定するのでcenter
        ctx.textBaseline = 'center'
        ctx.textAlign = 'center'
        for(var i = 0;i < column.length;i++) {
          ctx.fillText(column[i], canvas.width / 2, canvas.height / 2 + lineHeight * i - lineHeight * (column.length - 1) / 2)
        }
        
        ctx.font = '30px azuki'
        ctx.fillStyle = '#fff'
        ctx.fillText('お手サー', canvas.width / 6, canvas.height / 1.058)
      })
    }
  }
}