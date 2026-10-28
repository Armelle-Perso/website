// "Creative path": Armelle's text on how the painting evolved, 2011–2026.
// Source drafts: EVOLUTION-TEXT-2011-2026-draft17.md (EN) and its FR/ES
// versions. Paragraphs use **Series** for a link to the series page and
// *Title* for italics; see components/RichLine in the page.

export type CreativePath = {
  title: string
  intro: string[]
  sections: { heading: string; paragraphs: string[] }[]
  source: string
}

// Series name as written in the text -> series slug
export const SERIES_LINKS: Record<string, string> = {
  Prakriti: '2011',
  Endorphines: 'endorphines-2012',
  'Axis Mundi': '2012-2013',
  Nebula: '2014',
  'Émanation': '2015-2016',
  'Morphogenèse': 'morphogenese-2015-2016',
  Caminos: 'caminos-2017-2018',
  Hidrocoria: '2018-2019',
  Cuadritos: '2018-2019',
  Transforma: 'transforma-2020',
  Lightcodes: 'lightcodes-2021',
  Diffraction: '2022-2023',
  'Inner Landscapes': 'inner-landscapes-2023',
  Serotiny: '2025-2026',
}

export const CREATIVE_PATH: Record<string, CreativePath> = {
  "en": {
    "title": "From matter to light",
    "intro": [
      "I never start a painting with an image in mind. I start with a process: paint poured onto a canvas lying on the floor, ink left to set at its own pace, sand brushing the canvas. I don't think, I feel. I listen, and connect to the energy that is present. I am channeling the painting, which comes through me as much as from me.",
      "I have been painting for twenty years. Placed side by side, the names of these paintings since 2011 tell a story I had not planned: a star forming, a cell organising, a seed waiting for fire, a slow movement from matter towards light. It is also a constant back-and-forth between two worlds: the outer one, of places, elements and people, and the inner one, of the body, energy and feeling. Each series begins in one and finds its echo in the other."
    ],
    "sections": [
      {
        "heading": "Matter first (2011–2014)",
        "paragraphs": [
          "At the beginning the paint had the last word, and the work moved between the outer elements and the body. In **Prakriti** (2011), named after the Sanskrit word for primordial nature, it runs, marbles and decides. **Endorphines** (2012) is about the rush the body feels from the inside, that surge of energy running through every nerve: the paint is sprayed onto white grounds until they glow. **Axis Mundi** (2012–2013) goes the other way, down into heavy matter, to meet ancestral forces: goddesses, signs, the earth itself. Then **Nebula** (2014) lifts everything into space, with compositions that burst from the centre, the way scattered matter gathers until a star is born.",
          "That year I co-founded M33, a collective studio named after a galaxy, the Triangulum, one of the most distant things the naked eye can see. Very different people gathered there and found their orbit around a shared place: a human galaxy, of sorts, and the paintings drew from that energy.",
          "I painted all of this on the floor, moving around the canvas, tilting it so the paint would run where it wanted, with the gestural freedom of abstract expressionism. In my 2014 monograph, Arthur van Hoey placed the work between action painting and lyrical abstraction, \"taking a path that is now its own by virtue of the very synthesis it proposes.\" He also links me to Georges Mathieu, who \"moreover inscribed his research on meaning in his pictorial work.\" That search for meaning carries on in the titles."
        ]
      },
      {
        "heading": "Outward and inward (2015–2016)",
        "paragraphs": [
          "In 2015 and 2016 the work breathed in two directions at once, outward towards the light and inward into the matter.",
          "**Émanation** kept the burst of Nebula, but now the light seemed to come from inside the matter: pale grounds, large formats, colour radiating outward, up to the triptych *Sol del Corazón*.",
          "**Morphogenèse** went inward, into the structure of matter itself. It began with experiments in Indian ink, where everything is a question of timing: the exact balance of texture, fluidity and time, so that the ink sets into natural fractal forms by itself, a biomorphic vocabulary of cells and branchings. *Experiment on Dynamic Forms*, which holds no paint at all, is its culmination."
        ]
      },
      {
        "heading": "Paths and water (2017–2019)",
        "paragraphs": [
          "**Caminos** follows an outer path that is also an inner one: a path through the desert, along an irrigation channel, up to the spring where the water bubbles from the ground. Dark grounds, lit by sparks of colour. The water carried on into **Hidrocoria** (2018–2019), named after seeds carried by water until they find where to take root. The palette cleared, landscapes appeared, and the forms took on outlines. Alongside them came the **Cuadritos**, from a love of the tiny."
        ]
      },
      {
        "heading": "Towards light (2020–2026)",
        "paragraphs": [
          "**Transforma** (2020) is about metamorphosis, the moment a living form becomes another, in the world of plants and in ourselves. Plant forms grow out of the night of black grounds, in colours close to psychedelic art, and for the first time an empty space breathes. From that space a new order appears: in **Lightcodes** (2021), patterns born under the stars, the forms gather into the symmetries and mandalas of sacred geometry, in the spirit of visionary art, drawn with a precise Posca line on linen and papyrus. After the codes, the light opens up. **Diffraction** (2022–2023) follows what it does when it meets an obstacle: it bends, opens and breaks into colour. And what opens outside opens inside too: **Inner Landscapes** (2023) looks at how inner states are mirrored in the landscapes around us, and how the outer world shapes what we feel. White lines cross fluid grounds, under titles that all speak of opening: *Unfolding*, *Unlocking*, *Opening Up*.",
          "And then **Serotiny** (2025–2026). Some seeds stay sealed in their cones for years, until the heat of a fire frees them. These paintings bring everything back together: the drips of the beginning, the line, the symbols, and real matter again, with lava sand in the paint."
        ]
      },
      {
        "heading": "Looking back",
        "paragraphs": [
          "The method has not changed: set something in motion, let it make its forms, listen, and connect to the energy that is there. What has changed is how much I bring to it. At first the matter decided almost everything. Now the line, the symbols and the colour join the conversation. And almost every title names the same moment, when something held inside is finally released, inside me and in the world: a star, a form, a seed, a light."
        ]
      }
    ],
    "source": "Arthur van Hoey, \"Entre abstraction lyrique et action painting\", in Armelle Boussidan, une Monographie (Galerie Le point Fort, Strasbourg, 2014). Translated from French."
  },
  "fr": {
    "title": "De la matière à la lumière",
    "intro": [
      "Je ne commence jamais une peinture avec une image en tête. Je commence par un processus : la peinture versée sur une toile posée au sol, l'encre qui prend à son rythme, le sable qui effleure la toile. Je ne pense pas, je ressens. J'écoute, et je me connecte à l'énergie présente. Je canalise la peinture, qui passe par moi autant qu'elle vient de moi.",
      "Je peins depuis vingt ans. Mis côte à côte, les noms de ces peintures depuis 2011 racontent une histoire que je n'avais pas prévue : une étoile qui se forme, une cellule qui s'organise, une graine qui attend le feu, un lent mouvement de la matière vers la lumière. C'est aussi un va-et-vient constant entre deux mondes : le monde extérieur, celui des lieux, des éléments et des personnes, et le monde intérieur, celui du corps, de l'énergie et du ressenti. Chaque série naît dans l'un et trouve son écho dans l'autre."
    ],
    "sections": [
      {
        "heading": "La matière d'abord (2011–2014)",
        "paragraphs": [
          "Au début, la peinture avait le dernier mot, et le travail circulait entre les éléments extérieurs et le corps. Dans **Prakriti** (2011), du mot sanskrit qui désigne la nature première, elle coule, se marbre et décide. **Endorphines** (2012) parle de la montée que le corps ressent de l'intérieur, cette vague d'énergie qui traverse chaque nerf : la peinture est pulvérisée sur des fonds blancs jusqu'à ce qu'ils rayonnent. **Axis Mundi** (2012–2013) prend le chemin inverse et descend dans la matière dense, à la rencontre des forces ancestrales : déesses, signes, la terre elle-même. Puis **Nebula** (2014) emporte tout dans l'espace, avec des compositions qui éclatent depuis le centre, comme la matière éparse se rassemble jusqu'à ce que naisse une étoile.",
          "Cette année-là, j'ai cofondé M33, un atelier collectif qui porte le nom d'une galaxie, celle du Triangle, l'un des objets les plus lointains visibles à l'œil nu. Des personnes très différentes s'y sont rassemblées et ont trouvé leur orbite autour d'un lieu partagé : une sorte de galaxie humaine, et les peintures se sont nourries de cette énergie.",
          "J'ai peint tout cela au sol, en tournant autour de la toile, en l'inclinant pour que la peinture coule là où elle voulait, avec la liberté gestuelle de l'expressionnisme abstrait. Dans la monographie qui m'a été consacrée en 2014, Arthur van Hoey situe ce travail entre action painting et abstraction lyrique, « en empruntant un chemin qui lui est désormais propre en raison même de la synthèse proposée ». Il me rapproche aussi de Georges Mathieu, qui « inscrivait d'ailleurs dans son œuvre picturale, ses recherches sur la signification ». Cette recherche du sens se prolonge dans les titres."
        ]
      },
      {
        "heading": "Vers le dehors, vers le dedans (2015–2016)",
        "paragraphs": [
          "En 2015 et 2016, le travail a respiré dans deux directions à la fois : vers le dehors, vers la lumière, et vers le dedans, dans la matière.",
          "**Émanation** a gardé l'éclat de Nebula, mais la lumière semblait désormais venir de l'intérieur de la matière : fonds clairs, grands formats, couleur qui rayonne vers l'extérieur, jusqu'au triptyque *Sol del Corazón*.",
          "**Morphogenèse** est allée vers l'intérieur, dans la structure même de la matière. Elle a commencé par des expérimentations à l'encre de Chine, où tout est une question de timing : le rapport exact entre texture, fluidité et temps, pour que l'encre fige d'elle-même des formes fractales naturelles, un vocabulaire biomorphique de cellules et de ramifications. *Experiment on Dynamic Forms*, qui ne contient pas une goutte de peinture, en est l'apogée."
        ]
      },
      {
        "heading": "Chemins et eau (2017–2019)",
        "paragraphs": [
          "**Caminos** suit un chemin extérieur qui est aussi un chemin intérieur : un chemin à travers le désert, le long d'un canal d'irrigation, jusqu'à la source où l'eau sort de terre en bouillonnant. Fonds sombres, éclairés d'étincelles de couleur. L'eau a continué dans **Hidrocoria** (2018–2019), du nom des graines qui voyagent au fil de l'eau jusqu'à trouver où prendre racine. La palette s'est éclaircie, des paysages sont apparus, et les formes se sont cernées. À leurs côtés sont nés les **Cuadritos**, d'un amour du minuscule."
        ]
      },
      {
        "heading": "Vers la lumière (2020–2026)",
        "paragraphs": [
          "**Transforma** (2020) parle de métamorphose, le moment où une forme vivante en devient une autre, dans le monde des plantes et en nous-mêmes. Des formes végétales poussent dans la nuit des fonds noirs, avec des couleurs proches de l'art psychédélique, et pour la première fois un espace vide respire. De cet espace naît un ordre nouveau : dans **Lightcodes** (2021), des motifs nés sous les étoiles, les formes se rassemblent en symétries et en mandalas de géométrie sacrée, dans l'esprit de l'art visionnaire, tracées d'un trait de Posca précis sur lin et papyrus. Après les codes, la lumière s'ouvre. **Diffraction** (2022–2023) suit ce qu'elle fait quand elle rencontre un obstacle : elle se courbe, s'ouvre et se décompose en couleurs. Et ce qui s'ouvre dehors s'ouvre aussi dedans : **Inner Landscapes** (2023) explore le reflet de nos états intérieurs dans les paysages qui nous entourent, et l'empreinte du monde extérieur sur ce que nous ressentons. Des lignes blanches traversent des fonds fluides, sous des titres qui parlent tous d'ouverture : *Unfolding*, *Unlocking*, *Opening Up*.",
          "Puis vient **Serotiny** (2025–2026). Certaines graines restent enfermées dans leurs cônes pendant des années, jusqu'à ce que la chaleur d'un feu les libère. Ces peintures rassemblent tout : les coulures du début, la ligne, les symboles, et de nouveau la matière réelle, avec du sable de lave dans la peinture."
        ]
      },
      {
        "heading": "Avec le recul",
        "paragraphs": [
          "La méthode n'a pas changé : mettre quelque chose en mouvement, le laisser faire ses formes, écouter, et me connecter à l'énergie présente. Ce qui a changé, c'est la part que j'y apporte. Au début, la matière décidait presque tout. Aujourd'hui, la ligne, les symboles et la couleur entrent dans la conversation. Et presque chaque titre nomme le même moment, celui où ce qui était retenu à l'intérieur se libère enfin, en moi et dans le monde : une étoile, une forme, une graine, une lumière."
        ]
      }
    ],
    "source": "Arthur van Hoey, « Entre abstraction lyrique et action painting », dans Armelle Boussidan, une Monographie (Galerie Le point Fort, Strasbourg, 2014)."
  },
  "es": {
    "title": "De la materia a la luz",
    "intro": [
      "Nunca empiezo una pintura con una imagen en mente. Empiezo con un proceso: pintura vertida sobre un lienzo tendido en el suelo, tinta que fragua a su propio ritmo, arena que roza el lienzo. No pienso, siento. Escucho y conecto con la energía que está presente. Canalizo la pintura, que pasa a través de mí tanto como sale de mí.",
      "Llevo veinte años pintando. Puestos uno al lado del otro, los nombres de estas pinturas desde 2011 cuentan una historia que no había previsto: una estrella que se forma, una célula que se organiza, una semilla que espera el fuego, un lento movimiento de la materia hacia la luz. Es también un ir y venir constante entre dos mundos: el exterior, el de los lugares, los elementos y las personas, y el interior, el del cuerpo, la energía y lo que se siente. Cada serie nace en uno y encuentra su eco en el otro."
    ],
    "sections": [
      {
        "heading": "Primero la materia (2011–2014)",
        "paragraphs": [
          "Al principio la pintura tenía la última palabra, y la obra se movía entre los elementos exteriores y el cuerpo. En **Prakriti** (2011), que toma su nombre de la palabra sánscrita para la naturaleza primordial, corre, se jaspea y decide. **Endorphines** (2012) habla del subidón que el cuerpo siente desde dentro, esa oleada de energía que recorre cada nervio: la pintura se pulveriza sobre fondos blancos hasta que brillan. **Axis Mundi** (2012–2013) toma el camino contrario y baja a la materia densa, al encuentro de las fuerzas ancestrales: diosas, signos, la tierra misma. Luego **Nebula** (2014) lo eleva todo al espacio, con composiciones que estallan desde el centro, como la materia dispersa se reúne hasta que nace una estrella.",
          "Ese año cofundé M33, un taller colectivo que lleva el nombre de una galaxia, la del Triángulo, uno de los objetos más lejanos que se pueden ver a simple vista. Personas muy distintas se reunieron allí y encontraron su órbita alrededor de un lugar compartido: una especie de galaxia humana, y las pinturas se nutrieron de esa energía.",
          "Pinté todo esto en el suelo, moviéndome alrededor del lienzo, inclinándolo para que la pintura corriera hacia donde quería, con la libertad gestual del expresionismo abstracto. En la monografía que me dedicaron en 2014, Arthur van Hoey situó la obra entre el action painting y la abstracción lírica, «tomando un camino que ahora le es propio en razón misma de la síntesis propuesta». También me acerca a Georges Mathieu, quien «inscribía además en su obra pictórica sus investigaciones sobre la significación». Esa búsqueda de sentido continúa en los títulos."
        ]
      },
      {
        "heading": "Hacia fuera y hacia dentro (2015–2016)",
        "paragraphs": [
          "En 2015 y 2016 la obra respiró en dos direcciones a la vez: hacia fuera, hacia la luz, y hacia dentro, en la materia.",
          "**Émanation** conservó el estallido de Nebula, pero ahora la luz parecía venir del interior de la materia: fondos claros, grandes formatos, color que irradia hacia fuera, hasta el tríptico *Sol del Corazón*.",
          "**Morphogenèse** fue hacia dentro, a la estructura misma de la materia. Empezó con experimentos con tinta china, donde todo es cuestión del momento justo: la relación exacta entre textura, fluidez y tiempo, para que la tinta fije por sí sola formas fractales naturales, un vocabulario biomórfico de células y ramificaciones. *Experiment on Dynamic Forms*, que no contiene ni una gota de pintura, es su punto culminante."
        ]
      },
      {
        "heading": "Caminos y agua (2017–2019)",
        "paragraphs": [
          "**Caminos** sigue un camino exterior que es también interior: un camino por el desierto, a lo largo de la acequia, hasta el nacimiento donde el agua brota a borbotones de la tierra. Fondos oscuros, iluminados por chispas de color. El agua continuó en **Hidrocoria** (2018–2019), que debe su nombre a las semillas que viajan por el agua hasta encontrar dónde echar raíces. La paleta se aclaró, aparecieron paisajes y las formas adquirieron contornos. A su lado nacieron los **Cuadritos**, del amor por lo diminuto."
        ]
      },
      {
        "heading": "Hacia la luz (2020–2026)",
        "paragraphs": [
          "**Transforma** (2020) habla de la metamorfosis, el momento en que una forma viva se convierte en otra, en el mundo de las plantas y en nosotros mismos. Formas vegetales crecen en la noche de los fondos negros, en colores cercanos al arte psicodélico, y por primera vez un espacio vacío respira. De ese espacio nace un orden nuevo: en **Lightcodes** (2021), patrones nacidos bajo las estrellas, las formas se reúnen en las simetrías y mandalas de la geometría sagrada, en el espíritu del arte visionario, trazadas con una línea precisa de Posca sobre lino y papiro. Después de los códigos, la luz se abre. **Diffraction** (2022–2023) sigue lo que hace cuando encuentra un obstáculo: se curva, se abre y se descompone en color. Y lo que se abre fuera se abre también dentro: **Inner Landscapes** (2023) explora el reflejo de nuestros estados interiores en los paisajes que nos rodean, y la huella del mundo exterior en lo que sentimos. Líneas blancas atraviesan fondos fluidos, bajo títulos que hablan todos de apertura: *Unfolding*, *Unlocking*, *Opening Up*.",
          "Y luego **Serotiny** (2025–2026). Algunas semillas permanecen selladas en sus piñas durante años, hasta que el calor de un fuego las libera. Estas pinturas lo reúnen todo: las chorreaduras del principio, la línea, los símbolos y, de nuevo, la materia real, con arena de lava en la pintura."
        ]
      },
      {
        "heading": "Mirando atrás",
        "paragraphs": [
          "El método no ha cambiado: poner algo en movimiento, dejar que haga sus formas, escuchar y conectar con la energía presente. Lo que ha cambiado es cuánto aporto yo. Al principio la materia lo decidía casi todo. Ahora la línea, los símbolos y el color se suman a la conversación. Y casi cada título nombra el mismo momento, aquel en que lo que estaba guardado dentro por fin se libera, en mí y en el mundo: una estrella, una forma, una semilla, una luz."
        ]
      }
    ],
    "source": "Arthur van Hoey, «Entre abstraction lyrique et action painting», en Armelle Boussidan, une Monographie (Galerie Le point Fort, Estrasburgo, 2014). Traducida del francés."
  }
}
