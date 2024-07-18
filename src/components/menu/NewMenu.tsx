'use client'

import { useState } from "react";
import { Input } from "../ui/input";
import { FaPlus } from "react-icons/fa";
import { Button } from "../ui/button";
import { createMenu } from "../serverless/createMenu";

export default function NewMenus() {

    const [newMenuName, setNewMenuName] = useState('');
    
    const handleAddMenu = async () => {
        await createMenu(newMenuName);

        window.location.reload();
    };

    return (
        <div className="flex justify-center items-center gap-2">
            <Input
                type="text"
                value={newMenuName}
                onChange={(e) => setNewMenuName(e.target.value)}
                placeholder="Novo Menu"
                className="text-bg"
            />
            <Button onClick={handleAddMenu}>
                <FaPlus />
            </Button>
        </div>
    )
}