<template>
    <div class="pushPost">
        <div class="useinfo">
            <img class="useravatar" :src="apiStore.getBaseUrl() + apiStore.getPort() + userStore.get('u_avatar')" alt="">
            <div class="info">
                <div class="usernick">
                    {{ userStore.get('u_nick') }}
                </div>
                <div class="currdate">
                    {{ getCurrentDate() }}
                </div>
            </div>

        </div>
        <div class="content">
            <div class="posttitle">
                <span>标题:</span><input type="text">
            </div>
            <div class="postcontent">
                <textarea @input="textareaHeightAuto" ref="postcontent" rows="2"
                    placeholder="Enter the content here"></textarea>
            </div>

        </div>
        <div class="nav">
            <div class="picture fileico">
                <img src="/src/assets/img/pushPostPicture.png" alt="">Picture
            </div>
            <div class="video fileico">
                <img src="/src/assets/img/pushPostVideo.png" alt="">Video
            </div>
            <div class="video fileico">
                选择分区
            </div>
            <div class="send fileico">
                <img src="/src/assets/img/send.png" alt="">Send
            </div>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import { storeOfUser } from "../store/user"
import { storeOfApi } from "../store/api"
import { getCurrentDate } from "../tools/date"
const userStore = storeOfUser()
const apiStore = storeOfApi()


// 处理帖子内容高度自适应
let postcontent = ref()
// 控制textarea高度
function textareaHeightAuto() {
    const textarea = postcontent.value
    if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }
}
</script>

<style lang="less" scoped>
.pushPost {
    border: 1px solid rgba(0, 0, 0, 0.09);
    border-radius: 10px;
    padding: 20px;
    background-color: white;

    >.useinfo {
        height: 40px;
        display: flex;

        .useravatar {
            height: 40px;
            width: 40px;
            border-radius: 50%;
        }

        .info {
            height: 40px;
            display: flex;
            justify-content: center;
            flex-direction: column;
            padding: 0px 15px;

            >div {
                height: 15px;
                line-height: 15px;
            }

            .usernick {
                font-weight: bold;
            }

            .currdate {
                font-size: 14px;
                color: #676a79;
            }
        }
    }

    >.content {
        display: flex;
        flex-direction: column;
        min-height: 60px;
        padding: 5px 0px;

        .posttitle {
            // height: 30px;
            padding: 5px 0px;
            display: flex;

            span {
                line-height: 30px;
                color: #86b2ef;
            }

            input {
                flex: 1;
                border: 0px;
                outline: 0px;
                padding: 5px 10px;
                border: 1px solid #e1e4e6;
                color: #29292e;
                line-height: 1.5;
                font-weight: bold;
                border-radius: 5px;
                transition: all 0.2s;

                &:focus {
                    border: 1px solid #0f6fec;
                }
            }
        }

        .postcontent {
            min-height: 30px;

            textarea {
                width: 100%;
                height: 100%;
                border: 1px solid #e1e4e6;
                outline: none;
                resize: none;
                font-size: 16px;
                font-family: "黑体";
                box-sizing: border-box;
                padding: 5px;
                border-radius: 5px;

                &:focus {
                    border: 1px solid #0f6fec;
                }

                &::-webkit-scrollbar {
                    width: 0;
                    height: 0;
                }
            }
        }
    }

    >.nav {
        height: 30px;
        display: flex;

        .fileico {
            padding: 5px;
            background-color: #ebeaea;
            line-height: 15px;
            border-radius: 5px;
            color: #676a79;
            font-size: 14px;
            cursor: pointer;
            margin-right: 15px;

            &:hover {
                color: #47484b;
            }

            img {
                height: 15px;
                width: 15px;
                margin-right: 5px;
                position: relative;
                top: 50%;
                transform: translateY(-50%);
            }

        }

        .send {
            padding: 5px 15px;

            &:hover {
                background-color: #5865F2;
                color: white;
            }
        }
    }
}
</style>