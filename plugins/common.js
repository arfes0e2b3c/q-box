export default {
  modifyUrlInPost(posts, property) {
    posts.map((post) => {
      const url = post[property].match(
        /((https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi
      );
      post[property] = post[property].replace(
        /((https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,
        '<a href="' + url + '" target="_blank">リンク</a>'
      );
    });
  },
  async deletePost(that, id, config) {
    if (window.confirm("削除してよろしいですか？")) {
      await that.$axios
        .$delete("https://q-box.microcms.io/api/v1/q_box_posts/" + id, {
          headers: { "X-MICROCMS-API-KEY": config.microCmsKey },
        })
        .then(() => {
          that.getPosts();
        });
      alert("削除が完了しました。");
    }
  },
  async deleteReply(that, id, config) {
    if (window.confirm("非公開にしてよろしいですか？")) {
      await that.$axios
        .$patch(
          "https://q-box.microcms.io/api/v1/q_box_replies/" + id,
          {
            isDeleted: true,
          },
          {
            headers: { "X-MICROCMS-API-KEY": config.microCmsKey },
          }
        )
        .then(() => {
          that.fetchPostsHasReply();
        });
      alert("削除が完了しました。");
    }
  },
  generateImage(document, posts, mode, state) {
    for (const post of posts) {
      let image = new Image();
      if (state) {
        image.src = require("~/assets/img/" + state + ".png");
      } else if (post.state) {
        image.src = require("~/assets/img/" + post.state + ".png");
      } else {
        image.src = require("~/assets/img/answered.png");
      }
      image.onload = function () {
        let canvas = document.getElementById(post.id);
        let ctx = canvas.getContext("2d");
        canvas.width = 600;
        canvas.height = 315;
        let text = post[mode];
        let column = [""];
        let line = 0;
        for (const char of text) {
          if (
            char.match(/\n/) ||
            ctx.measureText(column[line] + char).width * 2 > canvas.width * 0.8
          ) {
            line++;
            column[line] = "";
          }
          column[line] += char;
        }
        let lineHeight = ctx.measureText("あ").width * 1.5 * 2;
        if (line > 7) {
          canvas.height = canvas.height + ((line - 7) * lineHeight * 21) / 16;
        }
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        //文字のスタイルを指定
        ctx.font = "20px azuki";
        ctx.fillStyle = "#404040";
        //文字の配置を指定（左上基準にしたければtop/leftだが、文字の中心座標を指定するのでcenter
        ctx.textBaseline = "center";
        ctx.textAlign = "center";
        for (var i = 0; i < column.length; i++) {
          ctx.fillText(
            column[i],
            canvas.width / 2,
            canvas.height / 2 +
              lineHeight * i -
              (lineHeight * (column.length - 1)) / 2
          );
        }
      };
    }
  },
  formatCreatedAt(posts) {
    posts.map((post) => {
      const pad2 = (n) => {
        return n < 10 ? "0" + n : n;
      };
      const date = new Date(post.createdAt);
      post.createdAt =
        pad2(date.getMonth() + 1) +
        "/" +
        pad2(date.getDate()) +
        " " +
        pad2(date.getHours()) +
        ":" +
        pad2(date.getMinutes());
      return post;
    });
    return posts;
  },
  filterPostAnswered(posts) {
    for (let post of posts) {
      post.replies = post.replies.filter((reply) => {
        return reply.replyAnswer;
      });
    }
    return posts;
  },
};
