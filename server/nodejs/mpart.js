var M = {
    v: 'V',
    f: function () {
        console.log(this.v);
    }
};

module.exports = M; // M 를 외부에서 사용할 수 있게 해줌