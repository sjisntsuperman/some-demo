interface TrackConfig<T> {
	TrackWidth: number;
	TrackHeight: number;
	offset: number;
	maxTrack?: number;
    el: HTMLCanvasElement;
    barrageList: any[]
}

class barrage {
	constructor(options?) {
        const defaultConfig={
            x: 200,
            y: 50,
            speed: 20,
            text: 'hello'
        }
        Object.assign(this, {...defaultConfig}, options);
        console.log(this);
    }

	render() {

    }
}

/**
 * @class track
 */
class track<T> {
    public offset: number;
	public TrackWidth: number;
	public barrageList: any[];
	public el: HTMLCanvasElement;
    public ctx: any;
    public id:number;

	constructor(options) {
		// const {
		//     offset, TrackWidth, TrackHeight, el, barrageList
		// } = options;

		Object.assign(this, options);
		this.ctx = this.el.getContext('2d');
	}

	public removeTop() {
        this.barrageList.shift();
    }

    public reset(){
        this.offset=0;
        this.barrageList=[];
    }

    public updateTrackOffset(speed){
        this.offset-=speed;
    }

	public render(handler) {
        // this.ctx
		
	}
}

class commander<T>{
    private tracks: any[];

    constructor(options){
        const defaultConfig: TrackConfig<T> = {
            TrackWidth: 200,
            TrackHeight: 200,
            offset: 200,
            el: document.querySelector('#canvas'),
            barrageList: [
                new barrage(), new barrage()
            ]
        };

        this.tracks=[];

        const {
            maxTrack = 4
        } = options;

        for (let i = 0; i < maxTrack; i++) {
            this.tracks.push(new track(defaultConfig));
        }
    }

    foreachTracks(handler:Function){
        for (let i = 0; i < this.tracks.length; i++) {
            const track = this.tracks[i];
            handler(track,i,this.tracks);
        }
    }

    // 将弹幕加入轨道
	add() {
        if(this.findTrack()==-1){
            return false;
        }
        const trackId=this.findTrack();
        const track=this.tracks[trackId];
        track.barrageList.push(
            barrage
        );

        return true;
    }

    findTrack():number {
        let idx=-1;
        this.foreachTracks((track,index)=>{
            const {offset, TrackWidth} = track;
            
            // this.track
            if(offset>TrackWidth){
                return idx;
            }else{
                // return 
                idx=track.id;
            }
        })
        return idx;
    }


    render(){
        this.foreachTracks((track,trackIndex)=>{
            const {
                barrageList, ctx, trackHeight, trackWidth
            } = track;
            if(barrageList.length==0) return;
            console.log(track,this);
            barrageList.forEach((barrage) => {
                const { speed, text, x, y } = barrage;
                if(x<=0){
                    track.removeTop();
                }
                console.log(barrage);
                // move barrage
                ctx.font = `${12}px 'Microsoft Yahei'`
                ctx.shadowBlur = 2
                ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
                ctx.clearRect(0, 0, trackWidth, trackHeight);
                // todo: font color
                // this.ctx.fillStyle();
                ctx.fillText(text, x, (trackIndex+1)*50);
                barrage.x=barrage.x-speed;

                // update track offset
                track.offset = track.offset-speed;
            });
        })
		requestAnimationFrame(() => this.render());
    }

    resize(){

    }
}

class BarrageDemo extends EventEmitter{
    private commander:any;

    constructor(){
        super();
        this.commander=new commander({maxTrack:4});
    }

    start(){
        this.commander.render();
    }
}

class EventEmitter{
    private state:object;

    constructor(){
        this.state={};
    }

    // $once(){

    // }

    $on(key, fn){
        if(!this.state[key]){
            this.state[key]=[]
        }
        this.state[key].push(fn);
    }

    $off(key){
        this.state[key]=[];
    }

    $emit(key){
        this.state[key].forEach(cb=>cb&&cb());
    }
}

new BarrageDemo().start();

// mock
