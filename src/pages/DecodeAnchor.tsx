import { Button } from "@blueprintjs/core";
import { BN, Idl, Provider } from "@project-serum/anchor";
import { Program } from "@project-serum/anchor/dist/cjs/program";
import { PublicKey } from "@solana/web3.js";
import { useContext, useState } from "react";
import { IDLInput } from "../components/IDLInput";
import camelcase from "camelcase";
import { useParams } from "react-router-dom";
import ReactJson from "react-json-view";
import { BallTriangle } from "react-loader-spinner";
import { IDLSelectMenu, Option } from "../components/IDLSelectMenu";
import { Toast } from "../components/Toaster";
import { Container } from "../components/UI";
import { ThemeContext } from "../contexts/themeContext";
import { connectionContext } from "../contexts/connectionContext";

export const DecodeAnchor = () => {
  const { accountPubkey, network } =
    useParams<{ accountPubkey: string; network: string }>();
  const [program, setProgram] = useState<Program>();
  const { connection } = useContext(connectionContext);
  const [idl, setIDL] = useState<any>();
  const [options, setOptions] = useState<Option[]>([]);
  const [accountContents, setAccountContents] = useState<any>();
  const [isLoading, setLoading] = useState(false);

  const isDark = useContext(ThemeContext);
  console.log(network);
  const handleSubmit = () => {
    try {
      setProgram(
        new Program(
          idl! as Idl,
          new PublicKey(idl!.metadata.address ? idl!.metadata.address : 0),
          { connection } as Provider
        )
      );
    } catch (error) {
      Toast.show({
        intent: "danger",
        message: "Unable to parse Program from IDL File",
      });
    }
  };

  const validateIDL = (file: File) => {
    try {
      const idlJSON = JSON.parse(file.toString());
      setIDL(idlJSON);
      setOptions(
        idlJSON.accounts.map((account: any) => {
          return { label: account.name, value: account.name };
        })
      );
    } catch (error) {
      Toast.show({
        intent: "danger",
        message: "Unable to parse IDL from file",
      });
    }
  };

  function decodeObject(object: any) {
    const decodedObject: { [key: string]: any } = {};
    if (
      object instanceof Object &&
      !(object instanceof PublicKey) &&
      !(object instanceof BN) &&
      !(typeof object === "string") &&
      !(typeof object === "number")
    ) {
      for (const [key, value] of Object.entries(object)) {
        decodedObject[key] = decodeObject(value);
      }
      return decodedObject;
    } else if (object !== null) {
      return object.toString();
    }
  }

  const onDropDownChange = async (value: string) => {
    try {
      setLoading(true);

      const objectEntries = Object.entries(
        await program!.account[camelcase(value)].fetch(
          new PublicKey(accountPubkey!)
        )
      ).map((x: any) => {
        const [key, value] = x;

        if (value instanceof PublicKey) {
          return [key, value.toString()];
        } else if (value instanceof BN) {
          return [key, value.toString()];
        } else if (value instanceof Object) {
          return [key, decodeObject(value)];
        } else {
          return [key, value];
        }
      });

      const object: { [key: string]: any } = {};
      for (const entry of objectEntries) {
        object[entry![0] as any] = entry![1];
      }
      setAccountContents(object);
    } catch (error) {
      setLoading(false);
      Toast.show({
        intent: "danger",
        message: (error as any).toString(),
      });
    }
  };

  return !program ? (
    <div>
      <div>
        <IDLInput setFile={validateIDL} />
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  ) : (
    <Container>
      <IDLSelectMenu selectOption={onDropDownChange} options={options} />
      {accountContents ? (
        <ReactJson
          collapsed
          src={accountContents}
          style={{
            textAlign: "left",
            marginTop: 12,
            paddingRight: 24,
            background: isDark ? "rgb(25, 25, 25)" : "#e8dcb2",
          }}
          theme={isDark ? "twilight" : "rjv-default"}
        />
      ) : isLoading ? (
        <BallTriangle color="#ffba01" height={100} width={100} />
      ) : null}
    </Container>
  );
};
