<script>

</script>

<section>
    <form action="" class="flex-column">
        <input type="email" placeholder="email">
        <input type="password" placeholder="heslo">
        <input type="submit">
    </form>
</section>

<style>
    form{
        max-width: 400px;
        gap: 10px;
        margin: 0 auto;
        margin-top: 5%;
        padding: 10px;
        background-color: grey;
        border: 3px solid rgb(189, 189, 189);
        border-radius: 20px;
        input{
            border-radius: 20px;
            background-color: antiquewhite;
            border: 2px solid darkgray;
            font-size: var(--font-size-me);
            padding: 3px 10px;
            letter-spacing: var(--letter-spacing);
            word-spacing: var(--word-spacing);
            color: orange;
            font-weight: 700;
        }
        input[type=submit]{
            background-color: rgb(60, 59, 59);
        }
        input:hover,
        input:active,
        input:focus{
            outline:none;
            background-color: aliceblue;
            border: 2px solid orangered;
        }
        input[type=submit]:hover{
            background-color: orangered;
            color:  aliceblue;
        }
    }
</style>