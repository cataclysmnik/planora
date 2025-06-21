"use client";

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Aurora from "../../src/blocks/Backgrounds/Aurora/Aurora";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Section = {
    title: string;
    content: string;
};

export default function Home() {
    const [destination, setDestination] = useState("");
    const [days, setDays] = useState("");
    const [pace, setPace] = useState("leisurely");
    const [response, setResponse] = useState("");
    const [level2Sections, setLevel2Sections] = useState<Section[]>([]);
    const [mainContent, setMainContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const paceText =
                pace === "leisurely"
                    ? "Create a relaxed, leisurely-paced itinerary with plenty of free time and rest breaks."
                    : "Create a packed itinerary that covers as many attractions as possible each day.";

            const prompt = `Generate me a detailed ${days} day travel itinerary to ${destination} in markdown. ${paceText} Add a recommended time to travel at the first and a tips section at the end, both with "##" headers. All the days should have "###" headers. Do not use any horizontal dividers (---) in the response.`;

            const genAI = new GoogleGenerativeAI(
                process.env.NEXT_PUBLIC_GEMINI_API_KEY!
            );
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            const result = await model.generateContent(prompt);
            const responseText = result.response.text().replace(/^\s*[-]{3,}\s*$/gm, "");
            setResponse(responseText);
        } finally {
            setIsLoading(false);
        }
    };

    const parseResponse = (text: string) => {
        // Split for both level 2 and 3 headings
        const sections = text.split(/(?=##\s)/).filter(Boolean);
        const mainContent = sections[0];
        const level3Sections = mainContent.split(/(?=###\s)/).filter(Boolean);
        const level2Sections = sections.slice(1);

        return {
            level3Content: level3Sections,
            level2Sections: level2Sections,
        };
    };

    const formatLevel3Content = (sections: string[]) => {
        if (sections.length <= 1) {
            return <ReactMarkdown>{sections[0]}</ReactMarkdown>;
        }

        return (
            <Accordion type="single" collapsible className="w-full">
                {sections.map((section, index) => {
                    const titleMatch = section.match(/###\s*([^\n]+)/);
                    const title = titleMatch ? titleMatch[1] : `Section ${index + 1}`;
                    const content = section.replace(/###\s*[^\n]+/, "").trim();

                    return (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger>{title}</AccordionTrigger>
                            <AccordionContent>
                                <ReactMarkdown>{content}</ReactMarkdown>
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        );
    };

    return (
        <div className="h-full w-full">
            <Aurora
                colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
                blend={0.5}
                amplitude={1.0}
                speed={0.5}
            />
            <div className="p-4 max-w-3xl mx-auto">

                <div className="space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6 lg:pt-56 sm:pt-4">
                        <div className="flex gap-2">
                            <textarea
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                placeholder="Enter destination"
                                className="resize-none h-10 w-[300px] py-2 px-3 rounded-md border"
                            />
                            <input
                                type="number"
                                value={days}
                                onChange={(e) => setDays(e.target.value)}
                                placeholder="Days"
                                className="h-10 w-24 rounded-md border border-input px-3"
                                min="1"
                            />
                        </div>

                        <RadioGroup
                            defaultValue="leisurely"
                            onValueChange={setPace}
                            className="flex gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="leisurely" id="leisurely" />
                                <label htmlFor="leisurely">I want a leisurely pace</label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="packed" id="packed" />
                                <label htmlFor="packed">I want to see as much as possible</label>
                            </div>
                        </RadioGroup>

                        <Button type="submit">Generate Itinerary</Button>
                    </form>

                    {isLoading ? (
                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-[100px]" />
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="space-y-2">
                                            <Skeleton className="h-4 w-[200px]" />
                                            <Skeleton className="h-20 w-full" />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {[...Array(2)].map((_, i) => (
                                <Card key={i}>
                                    <CardHeader>
                                        <Skeleton className="h-6 w-[150px]" />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className="h-32 w-full" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : response ? (
                        <div className="space-y-4 leading-relaxed">
                            {/* Main content with ### sections in accordion */}
                            {formatLevel3Content(parseResponse(response).level3Content)}

                            {/* Level 2 sections in pre-opened accordion */}
                            <Accordion
                                type="multiple"
                                defaultValue={parseResponse(response).level2Sections.map(
                                    (_, i) => `item-${i}`
                                )}
                                className="w-full"
                            >
                                {parseResponse(response).level2Sections.map((section, index) => {
                                    const titleMatch = section.match(/##\s*([^\n]+)/);
                                    const title = titleMatch ? titleMatch[1] : `Section ${index + 1}`;
                                    const content = section.replace(/##\s*[^\n]+/, "").trim();

                                    return (
                                        <AccordionItem key={index} value={`item-${index}`}>
                                            <AccordionTrigger>{title}</AccordionTrigger>
                                            <AccordionContent>
                                                <div className="prose">
                                                    <ReactMarkdown>{content}</ReactMarkdown>
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
