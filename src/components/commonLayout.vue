<template>
    <el-container>
        <el-header>
            <nav-menu/>
        </el-header>
        <el-main style="margin-top: 2em;margin-bottom: 2em;">
            <el-row :gutter="25" type="flex" justify="center">
                <el-col :xs="23" :sm="17" :md="16">
                    <slot name="main"/>
                </el-col>
                <el-col :xs="0" :sm="5" :md="5">
                    <slot name="search"/>
                    <side-notice/>
                </el-col>
            </el-row>
        </el-main>
        <div class="tool" style="visibility: hidden; position: fixed">
			<span>
				<select id="skeletonList">
          <option value="111131">3★キョウカ（ハロウィン）</option>
        </select>
				<select id="classList" autocomplete="off">
					<option value="1">拳</option>       <!-- KNUCKLE -->
					<option value="2">短剑</option>     <!-- SHORTSWORD -->
					<option value="3">斧</option>       <!-- AX -->
					<option value="4">剑</option>       <!-- SWORD -->
					<option value="5">长剑</option>     <!-- LONGSWORD -->
					<option value="6">矛</option>       <!-- SPEAR -->
					<option value="7">杖</option>       <!-- WAND -->
					<option value="8">弓</option>       <!-- ARROW -->
					<option value="9">匕首</option>     <!-- DAGGER -->
					<option value="10">长剑2</option>   <!-- LONGSWORD_2 -->
					<option value="21">杖_振袖</option> <!-- WAND_KIMONO -->
					<option value="22">剑_振袖</option> <!-- SWORD_KIMONO -->
					<option value="23">无杖法师</option> <!-- NO_WAND_WITCH -->
					<option value="24">Re:Zero</option> <!-- ??? -->
				</select>
				<input id="loadSkeleton" type="button" value="加载">
			</span>
            <span>
				<span> 动画:</span>
				<select id="animationList"><option value="idle">闲置</option><option value="standBy">准备</option><option
                        value="walk">走</option><option value="run">跑</option><option
                        value="run_gamestart">跑（入场）</option><option
                        value="landing">落地</option><option value="attack">攻击</option><option
                        value="attack_skipQuest">攻击（扫荡）</option><option
                        value="joy_short,hold,joy_short_return">庆祝-短</option><option
                        value="joy_long,hold,joy_long_return">庆祝-长</option><option value="damage">受伤</option><option
                        value="die,stop">死亡</option><option value="multi_standBy">合作-准备</option><option
                        value="multi_idle_standBy">合作-闲置</option><option value="multi_idle_noWeapon">合作-闲置（无武器）</option><option
                        disabled="">---</option><option value="103601_joyResult,stop">庆祝-角色特有</option><option
                        value="103601_skill0">技能0</option><option value="103601_skill1">技能1</option><option
                        value="103601_skill2">技能2</option>
        </select>
			</span>
            <div id="loading-text"></div>
        </div>
        <canvas id="spine-canvas" width="296" height="1305" style="position:fixed;"></canvas>
        <input id="setAnimation" type="button"
               style="position:fixed;bottom: 0;left: 5%;position: fixed;width: 22%;height: 30%;background-color: transparent;z-index: 500;border: none;-moz-appearance:none;-webkit-appearance : none ;border-radius: 0;outline:medium;">
        <my-footer/>
    </el-container>
</template>

<script>
    import NavMenu from "./NavMenu";
    import MyFooter from "../components/myFooter"
    import SideNotice from "../components/sideNotice"
    import 'element-ui/lib/theme-chalk/display.css'

    export default {
        name: "commonLayout",
        components: {NavMenu, MyFooter, SideNotice},
        data() {
            return {
                screenWidth: document.body.clientWidth,
            }
        },
    }
</script>

<style scoped>
    .el-header {
        padding: 0;
    }
</style>
