<script>

</script>

<section class="profil ">
    <h2>Tu ma možete kontakotvat</h2>
    <div class="profil-obsah">
            <img src="/img/Profil.jpg" alt="Obrazok Pata richnaka skladatela a spevaka">
        <ul class="contact-info flex-column">
            <li>E-mail: 
                <a href="mailto:pato.richnak@gmail.com"> pato.richnak@gmail.com</a>
            </li>
            <li>Telefon: 
                <a href="tel:+4219 0909 0909">+4219 0909 0909</a>
            </li>
            <li>Fabecook: 
                <a 
                href="https://www.facebook.com/people/Pa%C5%A5o-Richnak/        pfbid02sppv4HnfiGZjh1VAZfyqSRDuke4ASiCwKXBmCxV1r181u9GoraeAedCLTuuukz8Nl/" 
                target="_blank" 
                rel="noopener noreferrer">
                Pato Richnak</a>
            </li>
            <li>Instagram: 
                <a 
                    href="https://www.instagram.com/vosky_/" 
                    target="_blank" 
                    rel="noopener noreferrer">
                    vosky_</a>
            </li>
        </ul>
    </div>
    <p class="description">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Possimus ex sapiente numquam debitis, saepe rem! Impedit ducimus a praesentium, hic porro deserunt harum maiores obcaecati consequatur expedita est sint? Ad.
        Dolorum tempore nobis dolore magnam nesciunt eos obcaecati unde rem animi enim distinctio quia accusantium numquam corrupti quos ut deleniti, a id veritatis illo error nulla autem laborum? Asperiores, veritatis?
        Quo repellat quam reiciendis? Delectus excepturi eum in iusto consequatur esse, consequuntur eius aliquam. Reprehenderit molestiae pariatur dolores similique, enim temporibus, veniam repellat optio perferendis et accusamus quae delectus quia.
        Dolorem veniam doloremque quo in, accusamus perferendis dolorum omnis tempora fugiat ex eligendi facilis architecto! Incidunt, officia. Dolore quibusdam voluptatem, provident quisquam ipsa quos doloremque perspiciatis possimus quasi rerum. Neque?
        Molestiae omnis vel laborum rerum accusamus, quasi atque sequi quibusdam tempora nemo odio, quas deleniti beatae optio porro dicta iusto pariatur in provident quis, ipsum adipisci nam nesciunt! Sapiente, totam.
    </p>
</section>

<style>
    a{
        text-decoration: none;
        color: var(--button-hover-color);
    }

    .profil-obsah{
        display: flex;
        flex-direction: row;
        gap: 30px;
        margin-top: 30px;
    }
    img{
        max-width: 500px;
        max-height: 500px;
        border-radius: 15px;
    }
    .contact-info{
        font-size: var(--font-size-me);
        gap: 15px;
        padding: 0 5px;
        margin-top: 10px;
        li{
            border-bottom:2px solid var(--button-color);
            list-style: none;
            color: var(--text-color);
            font-weight: 600;
            padding: 3px 10px;
        }
    }

    .description{
        font-size: var(--font-size-sm);
        padding: 20px 5px;
    }

    @media(max-width:920px){
        .profil-obsah{
            flex-direction: column;
            img{
                margin: 0 auto;
            }
        }
        .description{
            margin-top: 30px;
        }
    }
</style>