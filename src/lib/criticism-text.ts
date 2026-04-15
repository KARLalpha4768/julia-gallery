export interface CriticismExcerpt {
  text: string;
  source: string;
  author: string;
  category: "literary" | "art" | "poetics";
}

export const CRITICISM_TITLE = "Reflections on Art, Journey & Vision";
export const CRITICISM_SUBTITLE = "Placing Seven Coloured Earth within the traditions of travel writing, plein air painting, and island poetics";

export const CRITICISM_EXCERPTS: CriticismExcerpt[] = [
  // ── Literary Criticism ──
  {
    category: "literary",
    author: "Thomas Worm",
    source: "Berlin, Journalist — Foreword to Seven Coloured Earth",
    text: `"The novel is about the adventures of a European tourist in Mauritius, Indian Ocean. Her personal experiences are closely tied to historical and religious events of a tropical and multicultural island. Narrative parts about nature, people, life and religions are atmospheric, compact, and covered with a refined poetry."`,
  },
  {
    category: "literary",
    author: "On the Tradition of the Artist-Traveller",
    source: "Critical Commentary",
    text: `Seven Coloured Earth belongs to a lineage of artist-voyage narratives that stretches from Delacroix's North African journals through Gauguin's Noa Noa to Patrick Leigh Fermor's Mediterranean wanderings. In each, the journey is not mere backdrop but catalyst — the foreign landscape cracks open the artist's perception, making the familiar technique inadequate and forcing invention. Julia's improvised pigments — saffron yellow, chilli red, burned-wood black — recall the material resourcefulness of cave painters at Lascaux, collapsing millennia into a single creative impulse: when the world demands to be painted, the painter finds a way.`,
  },
  {
    category: "literary",
    author: "On Ekphrasis and Narrative",
    source: "Critical Commentary",
    text: `What distinguishes this novel from conventional travel writing is its ekphrastic engine. The prose does not merely describe landscapes — it paints them. When Julia encounters the lagoon at Point d'Azur, the text itself becomes a watercolour: "the waves turning from aqua-green into red-violet and cobalt blue. A helio-turquoise flashed inside the reef." This is writing that thinks in pigment, that structures sentences the way a painter layers washes. The result is a rare hybrid: a novel that teaches the reader to see as a painter sees — not objects, but relations of light and colour.`,
  },
  {
    category: "literary",
    author: "On Cultural Polyphony",
    source: "Critical Commentary",
    text: `Mauritius itself becomes a character in this novel — an island where Hindu temples face Catholic churches across the street, where Creole, French, Hindi, and English weave through daily conversation, where roti sellers and French patisseries coexist in the same village. Julia does not observe this multicultural reality from a distance; she is absorbed into it. She eats Jasmine's spicy food until she falls ill, has her hands painted with henna, receives sacred ash at Tamil temples. The novel's genius is that it never exoticizes — it simply records, with the painter's trained eye, what is there.`,
  },

  // ── Art Criticism ──
  {
    category: "art",
    author: "On Plein Air Painting and the Impressionist Legacy",
    source: "Critical Commentary",
    text: `Julia's practice at Point d'Azur — painting the same motif at different times of day, watching how light transforms the volcanic rock of Coin de Mire — places her squarely in the lineage of Monet's haystacks and Cézanne's Mont Sainte-Victoire. But where the Impressionists had paint shops on every Parisian corner, Julia must manufacture her own materials. This necessity transforms plein air painting from bourgeois leisure into something more primal: a confrontation between the human desire to capture beauty and the physical reality of making marks on surfaces. Her organic paints — their impermanence, their vulnerability to lizards — become metaphors for the transience she is trying to arrest.`,
  },
  {
    category: "art",
    author: "On the Search for Blue",
    source: "Critical Commentary",
    text: `Julia's quest for ultramarine is the novel's most quietly profound passage. Blue — the colour of distance, of sky, of the infinite — has always been the most elusive pigment. The ancient Egyptians ground lapis lazuli; medieval monks hoarded it like gold; Yves Klein patented his own International Klein Blue. Julia's hunt through Port Louis — Chinese rub stones, bottled indigo from the bazaars, water-soluble pencils from a bookstore, a single tube of ultramarine from a French gallery — compresses the entire history of blue pigment into one woman's afternoon errands. It is both comic and sacred, a shopping list that doubles as art history.`,
  },
  {
    category: "art",
    author: "On Alla Prima and the Secret of Purity",
    source: "Critical Commentary",
    text: `The revelation that her thin-paper, alla prima sketches were "more expressive" than the later, technically superior watercolours on proper paper contains a truth that art schools spend years trying to teach: spontaneity cannot be improved upon. First marks carry conviction. This is the lesson of Zen calligraphy, of Matisse's cut-outs, of Basquiat's raw canvases. Julia discovers it not through theory but through poverty — she paints on cheap paper because she cannot afford better, and the constraint becomes a gift. "They had the secret of purity," she writes. It is possibly the most important sentence in the novel.`,
  },
  {
    category: "art",
    author: "John Ruskin",
    source: "Modern Painters, Vol. I (1843)",
    text: `"The greatest thing a human soul ever does in this world is to see something, and tell what it saw in a plain way. Hundreds of people can talk for one who can think, but thousands can think for one who can see. To see clearly is poetry, prophecy, and religion, all in one."`,
  },

  // ── Poetics ──
  {
    category: "poetics",
    author: "Derek Walcott",
    source: "The Sea is History (1979)",
    text: `"Where are your monuments, your battles, your martyrs?\nWhere is your tribal memory? Sirs,\nin that grey vault. The sea. The sea\nhas locked them up. The sea is History."`,
  },
  {
    category: "poetics",
    author: "On Walcott and Island Memory",
    source: "Critical Commentary",
    text: `When the Coin de Mire speaks to Julia of ships arriving "flying different flags, sailors speaking different languages, fighting against each other," of workers brought from the East with false promises, of the dead thrown overboard whose "dreams ending on the ocean floor" — the novel enters Walcott's territory. The sea around Mauritius, like the sea around St. Lucia, is a liquid archive. Julia's act of painting this sea is an act of witnessing: she captures on paper what the island remembers in its coral bones.`,
  },
  {
    category: "poetics",
    author: "Charles Baudelaire",
    source: "L'Invitation au Voyage (1857)",
    text: `"My child, my sister,\nThink of the rapture\nOf living together there!\nOf loving at will,\nOf loving till death,\nIn the land that is like you!\n\nThere, all is order and beauty,\nLuxury, peace and pleasure."`,
  },
  {
    category: "poetics",
    author: "On Baudelaire's Voyage and Julia's Journey",
    source: "Critical Commentary",
    text: `Baudelaire's dream of escape — to a land of "order and beauty, luxury, peace and pleasure" — is the same impulse that drives Julia to answer Harald's advertisement. But where Baudelaire's voyage remains imaginary, Julia's is concrete and disillusioning: the "Villa Happy Days" is a hot oven, the companion a neurotic who flees within days, the paradise conceals poverty and illiteracy. Yet Julia stays. And in staying, she discovers something Baudelaire never could from his Parisian desk: that beauty is not found in perfection but in engagement, in the daily ritual of painting at dawn, in the exchange of art for fish, in the kindness of Mr. Nepaul and his artist-bread.`,
  },
  {
    category: "poetics",
    author: "Rainer Maria Rilke",
    source: "Letters to a Young Poet (1903)",
    text: `"If your daily life seems poor, do not blame it; blame yourself, tell yourself that you are not poet enough to call forth its riches; for to the creator there is no poverty and no poor indifferent place."`,
  },
  {
    category: "poetics",
    author: "On Rilke, Seeing, and the Painter's Eye",
    source: "Critical Commentary",
    text: `Julia embodies Rilke's injunction completely. Before her, Pereybere is a sleepy village with stray dogs and flat-roofed villas; in her eyes, it becomes a stage for colour, ritual, and human connection. She does not merely endure her circumstances — she transforms them. Her primitive kitchen is a workshop; the lagoon is her studio; a fisherman's boat is a canvas. This is the Rilkean act of attention: making the ordinary radiant through the sheer intensity of one's looking. Painting, for Julia, is not a career or a hobby. It is — as Rilke said of poetry — "a way of life."`,
  },
  {
    category: "poetics",
    author: "On Colour as Spiritual Practice",
    source: "Critical Commentary",
    text: `The novel's title — Seven Coloured Earth — points to the geological wonder at Chamarel, but it also describes Julia's entire spiritual arc. She arrives colourless, depleted, in pain. Over months of painting, she assembles a palette — literally, from saffron and earth and chilli — that mirrors her inner restoration. Each colour she creates is an act of healing. The seven colours of Chamarel's exposed volcanic earth, with their reds and ochres and violets, are the island's own palette, revealed. When Julia holds up her glass tube of seven coloured soils at the end, she holds a reliquary — proof that the earth itself is an artist, and that to see its work clearly is to be made whole.`,
  },

  // ── More Art Criticism ──
  {
    category: "art",
    author: "Paul Gauguin",
    source: "Noa Noa: The Tahitian Journal (1901)",
    text: `"I have escaped everything that is artificial, conventional, customary. I am entering into the truth, into nature. Having the certainty of a succession of days like this one, equally free and beautiful, peace descends on me. I develop normally and no longer have such vain preoccupations."`,
  },
  {
    category: "art",
    author: "On Gauguin, Julia, and the Artist in Exile",
    source: "Critical Commentary",
    text: `The parallel with Gauguin is irresistible but must be handled carefully. Both artists flee Europe for a tropical island; both seek in the tropics a palette unavailable in northern latitudes; both find that the act of painting abroad transforms not just their art but their identity. But Julia is no Gauguin. She does not mythologize the natives or project fantasies onto them. She sits at their tables, eats their food, accepts their hospitality and its complications — including a marriage proposal — with directness and humour. Her Mauritius is no "primitive paradise" but a complex society with illiteracy, cyclones, and night intruders. What she shares with Gauguin is rarer than exoticism: the courage to stay when the villa is a disaster, the companion has fled, and the paradise is revealed as real — which is to say, imperfect, and therefore worth painting.`,
  },
  {
    category: "art",
    author: "Henri Matisse",
    source: "Notes of a Painter (1908)",
    text: `"What I dream of is an art of balance, of purity and serenity, devoid of troubling or depressing subject matter, an art which could be for every mental worker, for the businessman as well as the man of letters, for example, a soothing, calming influence on the mind, something like a good armchair which provides relaxation from physical fatigue."`,
  },
  {
    category: "poetics",
    author: "On the Novel as Watercolour",
    source: "Critical Commentary",
    text: `Seven Coloured Earth is, finally, a novel that behaves like a painting. It has no conventional plot — no crime to solve, no romance to consummate, no villain to overcome. Instead, it accumulates impressions: the taste of coconut water, the sound of a gecko's "chek-chek-chek," the violet shadow of a casuarina trunk on yellow sand. Each chapter is a wash laid over the last, building depth through transparency. The reader finishes the book as one finishes viewing a watercolour — not with the satisfaction of a story concluded, but with the lingering sensation of having seen, for a moment, through someone else's eyes. And those eyes saw colour everywhere.`,
  },
];
