"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { shuffle } from "@/hooks/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiSolidLock, BiSolidLockOpen } from "react-icons/bi";

const cardsWidth = 100;
const cardsHeight = 170;

export default function Page() {
	const [loading, setLoading] = useState(true);
	const [cards, setCards] = useState<Card[]>([]);
	const [deck, setDeck] = useState<Card[]>([]);
	const [name, setName] = useState("");
	const [order, setOrder] = useState<Order>("name");
	const [direction, setDirection] = useState<Direction>("ASC");
	const [isLocked, setIsLocked] = useState<boolean>(false);
	const [remainingCards, setRemainingCards] = useState<Card[]>([]);
	const [blobResults, setBlobResults] = useState<BlobResults>([]);
	const tries = 10000;
	const { toast } = useToast();

	useEffect(() => {
		fetchCards();
	}, []);

	const fetchCards = async () => {
		const data = await fetch("/api/get-cards").then((res) => res.json());
		for (const card of data) {
			setCards((cards) => [...cards, card]);
		}
		setCards((cards) =>
			cards
				.filter((card, index, self) => index === self.findIndex((c) => c.name === card.name))
				.filter((card) => card.status === "released")
				.filter((card) => card.source !== "None")
				.filter((card) => card.source !== "Not Available"),
		);
	};

	const clickCard = (card: Card) => {
		if (deck.find((c) => c.cid === card.cid)) {
			setDeck((deck) => deck.filter((c) => c.cid !== card.cid));
		} else {
			if (deck.length < 12) {
				setDeck((deck) => [...deck, card]);
			}
		}
		console.log(card.name);
	};

	const clickDeckCard = (card: Card) => {
		if (isLocked) {
			if (remainingCards.find((c) => c.cid === card.cid)) {
				setRemainingCards((remainingCards) => remainingCards.filter((c) => c.cid !== card.cid));
			} else {
				setRemainingCards((remainingCards) => [...remainingCards, card]);
			}
		} else {
			setDeck((deck) => deck.filter((c) => c.cid !== card.cid));
		}
	};

	const calculateBlobPower = () => {
		let blobPower = 0;
		let remainingCardsInDeck = remainingCards;
		while (blobPower < 15 && remainingCardsInDeck.length > 0) {
			remainingCardsInDeck = shuffle(remainingCardsInDeck);
			blobPower += remainingCardsInDeck.pop()?.power as number;
		}
		return blobPower;
	};

	const calculateBlobFrequency = () => {
		let results: BlobResults = [];
		for (let i = 0; i < tries; i++) {
			const power = calculateBlobPower();
			if (results.some((r) => r.power == power)) {
				results = results.map((r) => {
					if (r.power == power) {
						return {
							power: r.power,
							frequency: r.frequency + 1,
						};
					}
					return r;
				});
			} else {
				results = [...results, { power: power, frequency: 1 }];
			}
		}
		setBlobResults(results);
	};

	const generateDeckCode = () => {
		const jsonCode: JsonDeckCode = {
			Cards: [
				...deck.map((card) => {
					return {
						CardDefId: card.name.replaceAll(" ", ""),
					};
				}),
			],
		};
		const base64Code = btoa(JSON.stringify(jsonCode));
		navigator.clipboard.writeText(base64Code);
		toast({
			title: "Deck code copied to clipboard!",
			description: "You can now import the deck in-game.",
		});
	};

	const generateDeck = (base64Code: string) => {
		const jsonCode: JsonDeckCode = JSON.parse(atob(base64Code));
		const deckTemp: Card[] = [];
		console.log(jsonCode);
		for (const card of jsonCode.Cards) {
			const cardDefId = card.CardDefId;
			// const cardName is equal to card.name but whenever the following letter is a capital letter, it adds a space before it (unless it's the first letter or the letter before is a space or a -). it also adds a space before a number if the letter before is a letter. it also adds a space if the three next letters are "the" and the next letter is a capital letter.
			let cardName = formatCardName(cardDefId);
			console.log(cardName);
			const cardToAdd = cards.find((c) => c.name === cardName);
			if (cardToAdd) {
				deckTemp.push(cardToAdd);
			}
		}
		setDeck(deckTemp);
		console.log(deckTemp);
	};

	const formatCardName = (cardDefId: string): string => {
		let cardName = "";
		for (let i = 0; i < cardDefId.length; i++) {
			const previousChar = cardDefId[i - 1];
			const currentChar = cardDefId[i];
			const nextChar = cardDefId[i + 1];
			const nextNextChar = cardDefId[i + 2];
			const nextNextNextChar = cardDefId[i + 3];
			cardName += currentChar;
			if (i > 0 && nextChar && previousChar !== " " && previousChar !== "-") {
				if (nextChar.match(/[A-Z]/)) {
					cardName += " ";
				} else if (nextChar.match(/[0-9]/) && currentChar.match(/[A-z]/)) {
					cardName += " ";
				} else if (
					nextNextChar &&
					nextNextNextChar &&
					(currentChar === "t" || currentChar === "T") &&
					nextChar === "h" &&
					nextNextChar === "e" &&
					nextNextNextChar.match(/[A-Z]/)
				) {
					cardName += " ";
				}
			}
		}
		return cardName;
	};

	return (
		<div className="flex min-h-screen flex-col items-center justify-between p-10">
			<div>
				<h1 className="text-4xl font-bold">Deck Builder</h1>
				<p className="text-xl">Click on a card to add it to your deck</p>
			</div>
			<div>
				<img src={`${cards.find(card => card.cid === 1)?.art}`} alt="" className="overflow-hidden w-[210px] h-[280px] object-cover border" />
				<div>
					<h2 className="text-2xl font-bold">Deck</h2>
					<div className="grid w-1/2 grid-cols-6 gap-2">
						{deck
							.sort((a, b) => a.cost - b.cost)
							.map((card) => {
								return (
									<Image
										key={card.cid}
										src={card.art}
										alt={card.name}
										width={cardsWidth}
										height={cardsHeight}
										className={`cursor-pointer object-cover ${
											remainingCards.find((c) => c.cid === card.cid) || !isLocked ? "opacity-100" : "opacity-50"
										}`}
										onClick={() => clickDeckCard(card)}
									/>
								);
							})}
					</div>
				</div>
				<div className={`${deck.length == 12 ? "flex" : "hidden"}`}>
					<button
						className="rounded-md border border-gray-400 px-4 py-2"
						onClick={() => {
							setIsLocked((isLocked) => !isLocked);
							setRemainingCards(deck);
						}}
					>
						{isLocked ? <BiSolidLock /> : <BiSolidLockOpen />}
					</button>
					<div className={`${isLocked ? "flex" : "hidden"} flex-col items-center justify-between gap-2`}>
						<button className="rounded-md border border-gray-400 px-4 py-2" onClick={calculateBlobFrequency}>
							Blob Tool
						</button>
						<div>
							{blobResults.map((result, _) => {
								return (
									<div key={_}>
										<p>
											{result.power}: {Math.round((result.frequency / tries) * 100)}%
										</p>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
			<div className={`${isLocked ? "hidden" : "flex"} flex-col items-center justify-between gap-2`}>
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center">
						{/* <label className="mr-2">Name:</label> */}
						<input
							type="text"
							placeholder="Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="rounded-md border border-gray-400 px-2 py-1 text-black"
						/>
					</div>
					<div className="flex items-center gap-1">
						<label className="mr-2">Sort by:</label>
						<select
							value={order}
							onChange={(e) => setOrder(e.target.value as Order)}
							className="rounded-md border border-gray-400 px-2 py-1 text-black"
						>
							<option value="name">Name</option>
							<option value="cost">Cost</option>
							<option value="power">Power</option>
						</select>
						<select
							value={direction}
							onChange={(e) => setDirection(e.target.value as Direction)}
							className="rounded-md border border-gray-400 px-2 py-1 text-black"
						>
							<option value="ASC">Ascending</option>
							<option value="DESC">Descending</option>
						</select>
					</div>
				</div>
				<div className="grid grid-cols-8 gap-2">
					{cards
						.filter((card) => card.name.toLowerCase().includes(name.toLowerCase()))
						.sort((a, b) => {
							if (order === "name") {
								return direction === "ASC" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
							} else if (order === "cost") {
								return direction === "ASC" ? a.cost - b.cost : b.cost - a.cost;
							} else if (order === "power") {
								return direction === "ASC" ? a.power - b.power : b.power - a.power;
							} else {
								return 0;
							}
						})
						.map((card) => {
							return (
								<Image
									key={card.cid}
									src={card.art}
									alt={card.name}
									width={cardsWidth}
									height={cardsHeight}
									className={`cursor-pointer object-cover ${
										deck.find((c) => c.cid === card.cid) ? "opacity-50" : "opacity-100"
									}`}
									onClick={() => clickCard(card)}
								/>
							);
						})}
				</div>
			</div>
		</div>
	);
}
