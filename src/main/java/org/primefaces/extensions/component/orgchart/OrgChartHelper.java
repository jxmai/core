package org.primefaces.extensions.component.orgchart;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

public class OrgChartHelper {

    /**
     * 
     * @param root
     * @return
     */
    public static List<OrgChartNode> getAllNodesTraverseFromRoot(OrgChartNode root) {
        List<OrgChartNode> orgChartNodes = new ArrayList<OrgChartNode>();

        treeTraversal(root, orgChartNodes);

        return orgChartNodes;
    }

    /**
     * 
     * @param orgChartNodes
     * @return
     */
    public static HashMap<String, OrgChartNode> parseOrgChartNodesIntoHashMap(
            List<OrgChartNode> orgChartNodes) {

        HashMap<String, OrgChartNode> hashMap = new HashMap<String, OrgChartNode>();

        if (orgChartNodes != null && !orgChartNodes.isEmpty()) {

            if (null == orgChartNodes.get(0).getId() || orgChartNodes.get(0).getId().isEmpty()) {

            } else {
                for (OrgChartNode o : orgChartNodes) {
                    hashMap.put(o.getId(), o);
                }
            }
        }

        return hashMap;
    }

    /**
     * 
     * @param orgChartNode
     * @param orgChartNodes
     */
    private static void treeTraversal(OrgChartNode orgChartNode, List<OrgChartNode> orgChartNodes) {
        if (orgChartNode.getChildren().isEmpty()) {
            orgChartNodes.add(orgChartNode);
        } else {
            for (OrgChartNode o : orgChartNode.getChildren()) {
                treeTraversal(o, orgChartNodes);
            }
            // This line will be executed on backtrack
            orgChartNodes.add(orgChartNode);
        }
    }

}
