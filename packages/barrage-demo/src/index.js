var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var barrage = /** @class */ (function () {
    function barrage(options) {
        var defaultConfig = {
            x: 200,
            y: 50,
            speed: 20,
            text: 'hello'
        };
        Object.assign(this, __assign({}, defaultConfig), options);
        console.log(this);
    }
    barrage.prototype.render = function () {
    };
    return barrage;
}());
/**
 * @class track
 */
var track = /** @class */ (function () {
    function track(options) {
        // const {
        //     offset, TrackWidth, TrackHeight, el, barrageList
        // } = options;
        Object.assign(this, options);
        this.ctx = this.el.getContext('2d');
    }
    track.prototype.removeTop = function () {
        this.barrageList.shift();
    };
    track.prototype.reset = function () {
        this.offset = 0;
        this.barrageList = [];
    };
    track.prototype.updateTrackOffset = function (speed) {
        this.offset -= speed;
    };
    track.prototype.render = function (handler) {
        // this.ctx
    };
    return track;
}());
var commander = /** @class */ (function () {
    function commander(options) {
        var defaultConfig = {
            TrackWidth: 200,
            TrackHeight: 200,
            offset: 200,
            el: document.querySelector('#canvas'),
            barrageList: [
                new barrage(), new barrage()
            ]
        };
        this.tracks = [];
        var _a = options.maxTrack, maxTrack = _a === void 0 ? 4 : _a;
        for (var i = 0; i < maxTrack; i++) {
            this.tracks.push(new track(defaultConfig));
        }
    }
    commander.prototype.tracksForEach = function (handler) {
        for (var i = 0; i < this.tracks.length; i++) {
            var track_1 = this.tracks[i];
            handler(track_1, i, this.tracks);
        }
    };
    // 将弹幕加入轨道
    commander.prototype.add = function () {
        if (this.findTrack() == -1) {
            return false;
        }
        var trackId = this.findTrack();
        var track = this.tracks[trackId];
        track.barrageList.push(barrage);
        return true;
    };
    commander.prototype.findTrack = function () {
        var idx = -1;
        this.tracksForEach(function (track, index) {
            var offset = track.offset, TrackWidth = track.TrackWidth;
            // this.track
            if (offset > TrackWidth) {
                return idx;
            }
            else {
                // return 
                idx = track.id;
            }
        });
        return idx;
    };
    commander.prototype.render = function () {
        var _this = this;
        this.tracksForEach(function (track, trackIndex) {
            var barrageList = track.barrageList, ctx = track.ctx, trackHeight = track.trackHeight, trackWidth = track.trackWidth;
            if (barrageList.length == 0)
                return;
            console.log(track, _this);
            barrageList.forEach(function (barrage) {
                var speed = barrage.speed, text = barrage.text, x = barrage.x, y = barrage.y;
                if (x <= 0) {
                    track.removeTop();
                }
                console.log(barrage);
                // move barrage
                ctx.font = 12 + "px 'Microsoft Yahei'";
                ctx.shadowBlur = 2;
                ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
                ctx.clearRect(0, 0, trackWidth, trackHeight);
                // todo: font color
                // this.ctx.fillStyle();
                ctx.fillText(text, x, (trackIndex + 1) * 50);
                barrage.x = barrage.x - speed;
                // update track offset
                track.offset = track.offset - speed;
            });
        });
        requestAnimationFrame(function () { return _this.render(); });
    };
    commander.prototype.resize = function () {
    };
    return commander;
}());
var BarrageDemo = /** @class */ (function () {
    function BarrageDemo() {
        this.commander = new commander({ maxTrack: 4 });
    }
    BarrageDemo.prototype.start = function () {
        this.commander.render();
    };
    return BarrageDemo;
}());
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.state = {};
    }
    EventEmitter.prototype.$on = function (key, fn) {
        if (!this.state[key]) {
            this.state[key] = [];
        }
        this.state[key].push(fn);
    };
    EventEmitter.prototype.$off = function (key) {
        this.state[key] = [];
    };
    EventEmitter.prototype.$emit = function (key) {
        this.state[key].forEach(function (cb) { return cb && cb(); });
    };
    return EventEmitter;
}());
new BarrageDemo().start();
// mock
