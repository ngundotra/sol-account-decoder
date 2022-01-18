import { Idl } from "@project-serum/anchor";
import { Program } from "@project-serum/anchor/dist/cjs/program";
import { useSolana } from "@saberhq/use-solana";
import { PublicKey } from "@solana/web3.js";
import { useState } from "react";
import { IDLInput } from "../components/IDLInput";
import { SchemaInput } from "../components/SchemaInput";
import { Button } from "../elements";

export const DecodeAnchor = () => {
  const [program, setProgram] = useState<Program>();
  const { provider } = useSolana();
  const [idl, setIDL] = useState<any>();
  const [file, setFile] = useState<File>();
  const handleSubmit = () => {
    try {
      setProgram(
        new Program(
          idl! as Idl,
          new PublicKey(idl!.metadata.address ? idl!.metadata.address : 0),
          provider
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const validateIDL = (file:File) => {
    try {
      setIDL(file);
    } catch (error) {
      console.log(error);
    }
  };
  return !program ? (
    <div className="min-h-screen bg-yellow-50 py-8 px-4">
      <div className="flex flex-col items-center max-w-7xl mx-auto">
        <IDLInput setFile={validateIDL} />
        <Button className="px-3 py-3 my-4 w-full" onClick={handleSubmit}>
          Submit
        </Button>
      </div>
    </div>
  ) : (
    <>
     
    </>
  );
};
