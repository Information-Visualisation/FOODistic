<template>
    <div>
        <span class="food">F</span>
        <img id="apple" alt="apple" src="/apple_icon.png" width="17" />
        <span class="food">OD</span>
        <span class="rest">istics</span>
    </div>
</template>

<style scoped lang="scss">
@import "../../scss/custom.scss";
.food {
    color: $app-red;
    font-weight: bold;
}

.rest {
    color: $app-green;
}

#apple {
    margin-bottom: 7px;
    margin-left: 2px;
}
</style>