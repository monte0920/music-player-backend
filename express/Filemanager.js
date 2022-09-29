const fs = require("fs");
const uniqid = require("uniqid");

const UploaderManager = async ({ files }, filepath, callback) => {
    var index = 0;
    const array = [];

    if (!files) return callback([]);

    const process = (file) => {
        var filename = `${uniqid()}_${filepath}`;
        var originalname = file.originalname;
        var originalname = originalname.split(".");
        var new_path = `${__dirname}/uploads/${filepath}/${filename}.${originalname[originalname.length - 1]
            }`;
        var old_path = file.path;
        var save_path = filename + "." + originalname[originalname.length - 1];
        fs.readFile(old_path, (err, data) => {
            fs.writeFile(new_path, data, (err) => {
                fs.unlink(old_path, () => {
                    array.push({
                        field: file.fieldname,
                        type: file.mimetype,
                        realname: file.originalname,
                        name: save_path,
                        size: file.size,
                        external_url: `http://music.api.zlp.rasta.finance/${filepath}/${save_path}`
                    });
                    next_file = files[++index];
                    if (next_file) {
                        process(next_file);
                    } else {
                        callback(array);
                    }
                });
            });
        });
    };
    files[index] ? process(files[index]) : callback([]);
};

module.exports = UploaderManager;
