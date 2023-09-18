var gtts = require("node-gtts")("vi");
var path = require("path");
const fs = require("fs");
//var filepath = path.join(__dirname, "data/i-love-you.wav");
const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(cors());
app.get("/", (req, res) => {
  const folderPath = "data"; // Đường dẫn đến thư mục bạn muốn xóa các tệp con

  // Đọc danh sách tất cả các tệp trong thư mục
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Lỗi khi đọc thư mục:", err);
      return;
    }

    // Lặp qua danh sách các tệp và xóa chúng
    files.forEach((file) => {
      const filePath = path.join(folderPath, file);

      // Kiểm tra xem tệp có phải là thư mục không
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Lỗi khi kiểm tra tệp ${file}:`, err);
          return;
        }

        if (stats.isFile()) {
          // Nếu là tệp, thì xóa nó
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Lỗi khi xóa tệp ${file}:`, err);
            } else {
              console.log(`Đã xóa tệp ${file}`);
            }
          });
        }
      });
    });
  });
  console.log(req.query);
  const query = req.query.q;
  var filepath = path.join(__dirname, `data/${query}.wav`);
  gtts.save(filepath, query, function () {
    // Đọc tệp âm thanh
    const audioData = fs.readFileSync(filepath);

    // Cấu hình tiêu đề phản hồi để xác định loại nội dung là âm thanh
    res.setHeader("Content-Type", "audio/wav");

    // Phát tệp âm thanh
    res.send(audioData);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
