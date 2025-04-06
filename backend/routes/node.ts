import Router from "express";
import internalRequest from "../graphql/internal";

const query = `query Node($nodeId: ID!) {
  node(id: $nodeId) {
    id
    title
    number
    attributes {
      name
    }
    chooseNClasses {
      id
    }
    course_id
    dropdown_children
    department {
      abbreviation
    }
    prerequisite_ids
  }
}`;

interface NodeResponse {
    id: number;
    titleValue?: string;
    numberValue?: number;
    attributes?: string[];
    chooseNClasses?: number[];
    courseID?: number;
    dropdownChildren?: boolean;
    department?: string;
    preRecs: number[];
}

interface Node {
    id: number;
    title?: string;
    number?: number;
    attributes: string[];
    chooseNClasses: number[];
    course_id?: number;
    dropdownChildren?: boolean;
    department: { abbreviation?: string };
    prerequisite_ids: number[];
}

const router = Router();

router.get("/:id", async (req, res) => {
    try {
        const graphqlResult = await internalRequest(query, {
            nodeId: req.params.id,
        });

        if (!graphqlResult || !graphqlResult.node) {
            res.status(500).json({
                message: "Internal error"
            });
            return;
        }

        const temp: Node = graphqlResult?.node as Node;

        const response: NodeResponse = {
            id: temp.id,
            preRecs: temp.prerequisite_ids,
        };

        console.log(response, temp);

        if (temp.title) {
            response.titleValue = temp.title;
        }

        if (temp.number) {
            response.numberValue = temp.number;
        }

        if (temp.attributes && temp.attributes.length !== 0) {
            response.attributes = temp.attributes;
        }

        if (temp.chooseNClasses && temp.chooseNClasses.length !== 0) {
            response.chooseNClasses = temp.chooseNClasses;
        }

        if (temp.course_id) {
            response.courseID = temp.course_id;
        }

        if (
            temp.dropdownChildren !== null &&
            temp.dropdownChildren !== undefined
        ) {
            response.dropdownChildren = temp.dropdownChildren;
        }

        if (temp.department && temp.department.abbreviation) {
            response.department = temp.department.abbreviation;
        }

        res.json(response);
        return;
    } catch (e) {
        console.log(e);
        res.status(404).json({
            message: `Node with id ${req.params.id} not found`,
            error: e
        })
        return;
    }
});

export default router;
