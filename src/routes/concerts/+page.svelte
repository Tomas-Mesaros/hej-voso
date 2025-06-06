<script>

</script>

<section>
    <h2>Najblišie vystupenie</h2>
    <ul class="flex-column">
        <li >
            <img src="/img/Bratislava.jpeg" alt="Obrazok k akcie">
            <div class="flex-column concert">
                <a href="">28.5. 2025 Bratisla</a>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem distinctio dolore cupiditate maxime laboriosam facilis voluptatibus officia, minima magni expedita eum earum officiis! Tempore, ducimus labore dolor perferendis necessitatibus repellat?</p>
            </div>
        </li>
        <li >
            <img src="/img/Bratislava.jpeg" alt="Obrazok k akcie">
            <div class="flex-column concert">
                <a href="">28.5. 2025 Bratisla</a>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem distinctio dolore cupiditate maxime laboriosam facilis voluptatibus officia, minima magni expedita eum earum officiis! Tempore, ducimus labore dolor perferendis necessitatibus repellat?</p>
            </div>
        </li>
        <li >
            <img src="/img/Bratislava.jpeg" alt="Obrazok k akcie">
            <div class="flex-column concert">
                <a href="">28.5. 2025 Bratisla</a>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem distinctio dolore cupiditate maxime laboriosam facilis voluptatibus officia, minima magni expedita eum earum officiis! Tempore, ducimus labore dolor perferendis necessitatibus repellat?</p>
            </div>
        </li>
        <li >
            <img src="/img/Bratislava.jpeg" alt="Obrazok k akcie">
            <div class="flex-column concert">
                <a href="">28.5. 2025 Bratisla</a>
                <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptatem distinctio dolore cupiditate maxime laboriosam facilis voluptatibus officia, minima magni expedita eum earum officiis! Tempore, ducimus labore dolor perferendis necessitatibus repellat?</p>
            </div>
        </li>
    </ul>
</section>

<style>
    ul{
        width: 90%;
        font-size: var(--font-size-lg);
        margin: 0 auto;
        gap: 30px;
        
        li{
            display: flex;
            flex-direction: row;
            list-style: none;
            gap: 10px;
            border-bottom: 1px solid var(--button-color);
            img{
                width: 40%;
                margin: 0 10px;
                order: 1;
            }

            .concert{
                gap: 10px;
                order: 2
            }
            a{
                text-decoration: none;
                color: var(--button-hover-color);
            }
            p{
                font-size: var(--font-size-sm);
            }
        }

            @media(max-width:950px){
        li{
            display: flex;
            flex-direction: column;
            text-align: center;
            img{
                order: 2;
                margin: 0 auto;
            }
            .concert{
                order:1;
            }

        }
    }
    }


</style>