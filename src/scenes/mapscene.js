import Phaser from 'phaser';
import { CONST } from '../components/const';
import { Correct } from '../components/helpers';

export class WorldMapScene extends Phaser.Scene {
    constructor() {
        super({
            key: CONST.SCENES.WORLDMAP,
        });
    }

    init(data) {
        console.log(data);
        console.log('I got it');
    }

    onChallenge1(player, zone) {
        console.log('I am here in the on this area method');
        this.cameras.main.shake(300);
        console.log('starting challenge 1');
    }

    onChallenge2(player, zone) {
        console.log('I am here in the on this area method');
        this.cameras.main.shake(300);
        console.log('starting challenge 2');
        this.cameras.main.fade(1000);
        this.cameras.main.fadeIn(1000);
    }

    onChallenge3(player, zone) {
        console.log('I am here in the on this area method');
        this.cameras.main.shake(300);
        console.log('starting challenge 3');
        this.cameras.main.fade(1000);
        this.cameras.main.fadeIn(1000);
    }

    onJobInterview(player, zone) {
        console.log('I am here in the on this area method');
        this.cameras.main.shake(300);
        console.log('starting JobInterview');
        this.cameras.main.fade(1000);
        this.cameras.main.fadeIn(1000);
    }

    onEndGame(player, zone) {
        console.log('I am here in the on this area method');
        this.cameras.main.shake(300);
        console.log('starting EngGame');
        this.cameras.main.fade(1000);
        this.cameras.main.fadeIn(1000);
    }

    preload() {
        // load resources here
    }

    create() {
        console.log('Starting World Map Scene');

        const map = this.make.tilemap({ key: 'map' });

        const grassTileSet = map.addTilesetImage('[A]Grass1_pipo', 'tgrass');
        const dirtTileSet = map.addTilesetImage('[A]Grass1-Dirt2_pipo', 'tdirt');
        const baseTileSet = map.addTilesetImage('[Base]BaseChip_pipo', 'base');
        const pondTileSet = map.addTilesetImage('[A]Water7_pipo', 'pond');
        const bombTileSet = map.addTilesetImage('[Base]BaseChip_pipo', 'base');

        const grassLayer = map.createStaticLayer('grass', grassTileSet, 0, 0);
        const pathLayer = map.createStaticLayer('below_player', dirtTileSet, 0, 0);
        const worldLayer = map.createStaticLayer('worldaround', baseTileSet, 0, 0);
        const pondLayer = map.createStaticLayer('waterpond', pondTileSet, 0, 0);
        const bombLayer = map.createStaticLayer('bombounce', bombTileSet, 0, 0);

        worldLayer.setCollisionByProperty({ collides: true });
        bombLayer.setCollisionByProperty({ collides: true });


        /* Check debug rendering for collide assets in layer*/
        const debugGraphics = this.add.graphics().setAlpha(0.75);
        worldLayer.renderDebug(debugGraphics, {
            tileColor: null, // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
            faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });

        this.player = this.physics.add.sprite(50, 100, 'player', 6);
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);

        //enables collide on worldLayer with player

        this.physics.add.collider(this.player, worldLayer);
        this.physics.add.collider(this.player, bombLayer);


        // capture main game area map objects
        let gA = map.objects[0].objects;

        //Player starting point
        this.player.setPosition(Correct.x(gA[0]), Correct.y(gA[0]));


        // defines game locations listeners from map objects - End Of the Game
        this.endGame = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        this.endGame.create(Correct.x(gA[1]), Correct.y(gA[1]), gA[1].width, gA[1].height);
        this.physics.add.overlap(this.player, this.endGame, this.onEndGame, false, this);

        // defines game locations listeners from map objects - Challenge 1 Area Listener
        this.ch1 = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        this.ch1.name = gA[2].name;
        this.ch1.create(Correct.x(gA[2]), Correct.y(gA[2]), gA[2].width, gA[2].height);
        this.physics.add.overlap(this.player, this.ch1, this.onChallenge1, false, this);

        // defines game locations listeners from map objects - Challenge 2 Area Listener
        this.ch2 = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        this.ch2.create(Correct.x(gA[3]), Correct.y(gA[3]), gA[3].width, gA[3].height);
        this.physics.add.overlap(this.player, this.ch2, this.onChallenge2, false, this);

        // defines game locations listeners from map objects - Challenge 3 Area Listener
        this.ch3 = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        this.ch3.create(Correct.x(gA[4]), Correct.y(gA[4]), gA[4].width, gA[4].height);
        this.physics.add.overlap(this.player, this.ch3, this.onChallenge3, false, this);

        // defines game locations listeners from map objects - Job Interview Area Listener
        this.ji1 = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        this.ji1.create(Correct.x(gA[5]), Correct.y(gA[5]), gA[5].width, gA[5].height);
        this.physics.add.overlap(this.player, this.ji1, this.onJobInterview, false, this);

        // enable keystroke detection
        this.cursors = this.input.keyboard.createCursorKeys();

        // enable camara
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = false;
    }

    update() {
        // Horizontal movement
        this.player.body.setVelocity(0); // plsyer is normally standing still after one step

        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-80);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(80);
        }

        // Vertical movement
        if (this.cursors.up.isDown) {
            this.player.body.setVelocityY(-80);
        } else if (this.cursors.down.isDown) {
            this.player.body.setVelocityY(80);
        }
    }
}

export default WorldMapScene;