"use client";

import {
  Button,
  Input,
  Label,
  Modal,
  Surface,
  TextField,
} from "@heroui/react";

export default function ApplyOpportunityModal({
  opportunity,
  session,
  portfolioLink,
  setPortfolioLink,
  motivationMessage,
  setMotivationMessage,
  handleApplySubmit,
}) {
  return (
    <Modal>
      <Button>Apply Now</Button>

      <Modal.Backdrop>
        <Modal.Container placement="auto">
          <Modal.Dialog className="sm:max-w-lg">

            <Modal.CloseTrigger />

            <Modal.Header>
              <Modal.Heading>
                Apply Opportunity
              </Modal.Heading>

              <p className="mt-1 text-sm text-muted">
                Submit your application for this opportunity.
              </p>
            </Modal.Header>

            <Modal.Body className="p-6">
              <Surface variant="default">

                <form
                  id="apply-form"
                  onSubmit={handleApplySubmit}
                  className="flex flex-col gap-4"
                >

                  <TextField>
                    <Label>Opportunity ID</Label>
                    <Input
                      value={opportunity?._id || ""}
                      readOnly
                    />
                  </TextField>

                  <TextField>
                    <Label>Applicant Email</Label>
                    <Input
                      value={session?.user?.email || ""}
                      readOnly
                    />
                  </TextField>

                  <TextField>
                    <Label>Portfolio Link</Label>
                    <Input
                      value={portfolioLink}
                      onChange={(e) =>
                        setPortfolioLink(e.target.value)
                      }
                      placeholder="https://portfolio.com"
                    />
                  </TextField>

                  <TextField>
                    <Label>Motivation Message</Label>
                    <Input
                      value={motivationMessage}
                      onChange={(e) =>
                        setMotivationMessage(e.target.value)
                      }
                      placeholder="Why do you want to join?"
                    />
                  </TextField>

                </form>

              </Surface>
            </Modal.Body>

            <Modal.Footer>
              <Button slot="close" variant="secondary">
                Cancel
              </Button>

              <Button
                type="submit"
                form="apply-form"
                slot="close"
              >
                Submit Application
              </Button>
            </Modal.Footer>

          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}